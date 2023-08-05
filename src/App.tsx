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
    const res = await fetch(`http://localhost:8080/orders/${orderId}/pick`, {
        method: "POST",
    });
    const data = await res.json();
    return data;
}

function Order(order: any) {
    return (
        <div>
            <p>{order.id}</p>
            <p>{order.storeId}</p>
            <p>{order.customer}</p>
            <p>{order.status}</p>
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
                {Order(order)}
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
                    Complete
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
