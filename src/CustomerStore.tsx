import React, { useEffect, useState } from "react";
import {} from "./helperFunctions/orderFunctions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./components/ui/select";

function Product(
    entry: any,
    key: number,
    setCart: Function,
    cart: any,
    ws: WebSocket
) {
    const addToCart = () => {
        const { ...newCart } = cart;
        const max = entry.quantity;
        console.log(newCart[entry.productId]);
        newCart[entry.productId] =
            newCart[entry.productId] != null
                ? newCart[entry.productId] >= max
                    ? max
                    : newCart[entry.productId] + 1
                : 1;
        setCart(newCart);
        console.log(cart);
        ws.send(JSON.stringify({ msg: "Cart Update", cart: cart }));
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
    const [ws, setWS] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");
        ws.onopen = () => {
            console.log("Websocket opened");
        };
        setWS(ws);
    }, []);
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
            <Select
                onValueChange={(value) => {
                    setStoreId(value);
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Store"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {customerOptions.stores.map((store: any) => {
                        return (
                            <SelectItem
                                value={store.id}
                                onClick={() => {
                                    setStoreId(store.id);
                                }}
                            >
                                {store.name}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
            <Select
                onValueChange={(value) => {
                    const customer = JSON.parse(value);
                    const state = { ...customerOptions };
                    state.addresses = customer.addresses;
                    setCustomerOptions(state);
                    setAddressId(null);
                    setCustomerId(customer.id);
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Customer"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {customerOptions.customers.map((customer: any) => {
                        return (
                            <SelectItem
                                value={JSON.stringify(customer)}
                                onClick={() => {
                                    const state = { ...customerOptions };
                                    state.addresses = customer.addresses;
                                    setCustomerOptions(state);
                                    setAddressId(null);
                                    setCustomerId(customer.id);
                                }}
                            >
                                {customer.name}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
            {customerOptions.addresses == null ? (
                <></>
            ) : (
                <Select
                    onValueChange={(value) => {
                        setAddressId(value);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Address"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {customerOptions.addresses.map((address: any) => {
                            return (
                                <SelectItem value={address.id}>
                                    {address.line1}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            )}
        </>
    ) : productData == null ? (
        <div>Loading</div>
    ) : (
        <>
            <div>
                {productData.map((entry: any, index: number) => {
                    return Product(
                        entry,
                        index,
                        setCart,
                        cart,
                        ws as WebSocket
                    );
                })}
            </div>
            <button onClick={order}>Order</button>
        </>
    );
}

export default CustomerStore;
