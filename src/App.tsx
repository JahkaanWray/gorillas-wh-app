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

async function pickOrder(orderId: string) {
    const body = {
        pickerId: "84a5001c-102a-4eec-9fab-b8d0fa22df42",
    };
    const res = await fetch(`http://localhost:8080/orders/${orderId}/pick`, {
        method: "POST",
        body: JSON.stringify(body),
    });
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
            <p>{order.customer}</p>
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
    const [data, setData] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const orders = await getOrders({
                status: "NEW",
            });
            setData(orders);
        };
        fetchData();
    }, []);
    const orderList = data.map((order: any, index) => {
        return (
            <li
                key={index}
                onClick={async () => {
                    const pickedOrder = await pickOrder(order.id);
                    console.log(pickedOrder.order);
                    setCurrentOrder(pickedOrder.order);
                }}
            >
                {" "}
                {Order(order)}{" "}
            </li>
        );
    });
    const orderPage = (order: any) => {
        return (
            <>
                {FullOrder(order)}
                <button
                    onClick={async () => {
                        await unpickOrder(order.id);
                        const orders = await getOrders({
                            status: "NEW",
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
    if (currentOrder) {
        return <>{orderPage(currentOrder)}</>;
    } else {
        return (
            <>
                <div>{currentOrder}</div>
                <div>{orderList}</div>
            </>
        );
    }
}

export default App;
