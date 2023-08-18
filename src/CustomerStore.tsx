import React, { useEffect, useState } from "react";

function Product(entry: any, key: number, setCart: Function, cart: any) {
    const addToCart = () => {
        const { ...newCart } = cart;
        const max = entry.quantity;
        newCart[entry.productId] =
            newCart[entry.productId] !== null
                ? newCart[entry.productId] >= max
                    ? max
                    : newCart[entry.productId] + 1
                : 1;
        setCart(newCart);
        console.log(cart);
    };
    return (
        <div key={key}>
            <div>
                {entry.product.name} x{entry.quantity}, {entry.store.name}
            </div>
            {cart[entry.productId]}
            <button onClick={addToCart}>+</button>
        </div>
    );
}

function CustomerStore() {
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [addressId, setAddressId] = useState<string | null>(null);
    const [customerOptions, setCustomerOptions] = useState<any>(null);
    const [productData, setProductData] = useState(null as any);
    const [cart, setCart] = useState({} as any);
    useEffect(() => {
        const getData = async () => {
            let res = await fetch(`http://localhost:8080/stores`);
            const stores = await res.json();
            res = await fetch("http://localhost:8080/customers");
            const customers = await res.json();
            setCustomerOptions({
                stores,
                customers,
            });
        };
        getData();
    }, []);

    useEffect(() => {
        if (storeId) {
            const getData = async () => {
                let res = await fetch(
                    `http://localhost:8080/inventory?` +
                        new URLSearchParams({ storeId: storeId }),
                    {}
                );
                const items = await res.json();
                setProductData(items);
            };
            getData();
        }
    }, [storeId]);

    async function order() {
        const productIds = Object.keys(cart);
        const items = productIds.map((id: string) => {
            return {
                productId: id,
                quantity: cart[id],
            };
        });
        await fetch("http://localhost:8080/orders", {
            method: "POST",
            body: JSON.stringify({
                customerId: customerId,
                storeId: storeId,
                addressId: addressId,
                items: items,
            }),
            headers: {
                "content-type": "application/json",
            },
        });
    }

    return customerOptions == null ? (
        <>Loading</>
    ) : storeId == null || customerId == null || addressId == null ? (
        <>
            {customerOptions.stores.map((store: any) => {
                return (
                    <div
                        onClick={() => {
                            setStoreId(store.id);
                        }}
                    >
                        {store.name}
                    </div>
                );
            })}
            ,
            {customerOptions.customers.map((customer: any) => {
                return (
                    <div
                        onClick={() => {
                            const state = { ...customerOptions };
                            state.addresses = customer.addresses;
                            setCustomerOptions(state);
                            setAddressId(null);
                            setCustomerId(customer.id);
                        }}
                    >
                        {customer.name}
                    </div>
                );
            })}
            ,
            {customerOptions.addresses == null ? (
                <></>
            ) : (
                customerOptions.addresses.map((address: any) => {
                    return (
                        <div
                            onClick={() => {
                                setAddressId(address.id);
                            }}
                        >
                            {address.line1}
                        </div>
                    );
                })
            )}
        </>
    ) : productData == null ? (
        <div>Loading</div>
    ) : (
        <>
            <div>
                {productData.map((entry: any, index: number) => {
                    return Product(entry, index, setCart, cart);
                })}
            </div>
            <button onClick={order}>Order</button>
        </>
    );
}

export default CustomerStore;
