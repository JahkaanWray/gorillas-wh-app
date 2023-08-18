import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

async function unpickOrder(orderId: string) {
    const res = await fetch(`http://localhost:8080/orders/${orderId}/unpick`, {
        method: "POST",
    });
    const data = await res.json();
    return data;
}

async function getOrders(params: any) {
    const res = await fetch(
        `http://localhost:8080/orders` + "?" + new URLSearchParams(params),
        {
            method: "GET",
        }
    );
    const data = await res.json();
    return data;
}
async function confirmOrder(orderId: string) {
    const res = await fetch(`http://localhost:8080/orders/${orderId}/confirm`, {
        method: "POST",
    });
    const data = await res.json();
    return data;
}

async function pickOrder(orderId: string, pickerId: string) {
    const body = {
        pickerId: pickerId,
    };
    const res = await fetch(`http://localhost:8080/orders/${orderId}/pick`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json",
        },
    });
    const data = await res.json();
    return data;
}

async function getUsers() {
    const res = await fetch(`http://localhost:8080/users`);
    const data = await res.json();
    return data;
}
function Order(order: any) {
    return (
        <div>
            <p>{order.id}</p>
            <p>{order.storeId}</p>
            <p>{order.customer.name}</p>
            <p>{order.status}</p>
        </div>
    );
}

function FullOrder(order: any) {
    return (
        <div>
            <p>{order.id}</p>
            <p>{order.store.name}</p>
            <p>{order.customer.name}</p>
            <p>{order.status}</p>
            <ul>
                {order.orderDetails.map((orderDetail: any, index: any) => {
                    return (
                        <li
                            key={index}
                        >{`${orderDetail.product.name} x${orderDetail.quantity}`}</li>
                    );
                })}
            </ul>
        </div>
    );
}

function App() {
    const [data, setData] = useState([] as any);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [pickerId, setPickerId] = useState<string | null>(null);
    const [pickerOptions, setPickerOptions] = useState<any | null>(null);
    const [storeId, setStoreId] = useState(null);
    const [ws, setWS] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");
        ws.onopen = () => {
            console.log("WS server opened");
        };
        setWS(ws);
    }, []);
    useEffect(() => {
        if (!pickerId) {
            const fetchData = async () => {
                const users = await getUsers();
                setPickerOptions(users);
            };
            fetchData();
        }
    }, [pickerId]);
    useEffect(() => {
        if (storeId) {
            const fetchData = async () => {
                const orders = await getOrders({
                    storeId: storeId,
                    status: "NEW",
                });
                setData(orders);
            };
            fetchData();
        }
    }, [storeId]);
    if (ws) {
        ws.onmessage = (event) => {
            console.log(event.data);
            console.log(data);
            const eventData = JSON.parse(event.data);
            console.log(eventData);
            if (eventData.msg == "Order Created") {
                const newData = [eventData.order, ...data];
                setData(newData);
                console.log(data);
            } else if (eventData.msg == "Picked Order" && data) {
                const newData = data.filter((order: any) => {
                    console.log(order.id);
                    return order.id != eventData.order.id;
                });
                console.log(eventData.order.id);
                setData(newData);
                console.log(data);
            } else if (eventData.msg == "Unpicked Order") {
                const newData = [eventData.order, ...data];
                console.log(newData);
                setData(newData);
                console.log(data);
            }
            console.log(data);
        };
    }
    console.log(data);
    const orderList = () => {
        return data.map((order: any, index: number) => {
            return (
                <li
                    key={index}
                    onClick={async () => {
                        const pickedOrder = await pickOrder(
                            order.id,
                            pickerId as string
                        );
                        console.log(pickedOrder);
                        setCurrentOrder(pickedOrder);
                        console.log(currentOrder);
                    }}
                >
                    {" "}
                    {Order(order)}{" "}
                </li>
            );
        });
    };
    const orderPage = (order: any) => {
        return (
            <>
                {FullOrder(order)}
                <button
                    onClick={async () => {
                        await unpickOrder(order.id);
                        const orders = await getOrders({
                            status: "NEW",
                            storeId: storeId,
                        });
                        setData(orders);
                        setCurrentOrder(null);
                    }}
                >
                    Back
                </button>
                <button
                    onClick={async () => {
                        await confirmOrder(order.id);
                        const orders = await getOrders({
                            status: "NEW",
                            storeId: storeId,
                        });
                        setData(orders);
                        setCurrentOrder(null);
                    }}
                >
                    Confirm
                </button>
            </>
        );
    };
    if (!pickerId && pickerOptions) {
        return (
            <>
                {pickerOptions.map((picker: any, index: number) => {
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                setPickerId(picker.id);
                                console.log(picker);
                                setStoreId(picker.stores[0].id);
                            }}
                        >
                            {picker.name}, {picker.stores[0].name}
                        </div>
                    );
                })}
            </>
        );
    }
    if (currentOrder) {
        return <>{orderPage(currentOrder)}</>;
    } else if (data) {
        return (
            <>
                <button
                    onClick={() => {
                        setPickerOptions(null);
                        setData([]);
                        setPickerId(null);
                        setStoreId(null);
                    }}
                >
                    Back
                </button>
                <div>{currentOrder}</div>
                <div>{orderList()}</div>
            </>
        );
    } else {
        return <>Loading</>;
    }
}

export default App;
