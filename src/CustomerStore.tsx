import React, { useEffect, useState } from "react";

function Product(entry: any, key: number, setCart: Function, cart: any) {
    const addToCart = () => {
        const { ...newCart } = cart;
        const max = entry.quantity;
        newCart[entry.productId] = newCart[entry.productId]
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
    const [productData, setProductData] = useState(null as any);
    const [cart, setCart] = useState({} as any);
    useEffect(() => {
        const getData = async () => {
            const res = await fetch("http://localhost:8080/inventory");
            const data = await res.json();
            setProductData(data);
        };
        getData();
    }, []);

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
                customerId: "0a858e6f-d2d1-48f6-8638-066fa48b95d0",
                storeId: "6c13ec88-af7c-412b-adb5-0e656ae2b155",
                addressId: "ce0197d3-6205-427a-a79f-2836e8633cc6",
                items: items,
            }),
            headers: {
                "content-type": "application/json",
            },
        });
    }

    return productData == null ? (
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
