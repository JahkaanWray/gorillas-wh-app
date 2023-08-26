import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import {
    unpickOrder,
    getOrders,
    confirmOrder,
    pickOrder,
} from "./helperFunctions/orderFunctions";
import { getUsers } from "./helperFunctions/userFunctions";
import logo from "./logo.svg";
import "./styles/globals.css";
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "./components/ui/select";

function Order(order: any) {
    return (
        <>
            <Card className=" m-4 ">
                <CardHeader>
                    <CardTitle>{order.customer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{order.store.name}</p>
                    <p>{order.address.line1}</p>
                    <p>{order.orderDetails.length} items</p>
                    <p>{order.status}</p>
                </CardContent>
            </Card>
        </>
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
                        <Card key={index}>
                            <CardContent>
                                <CardTitle>
                                    {orderDetail.product.name}
                                </CardTitle>
                                <p>Barcode: {orderDetail.product.id}</p>
                                <p>Quantity: {orderDetail.quantity}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </ul>
        </div>
    );
}

function WHApp() {
    const [data, setData] = useState([] as any);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [pickerId, setPickerId] = useState<string | null>(null);
    const [pickerOptions, setPickerOptions] = useState<any | null>(null);
    const [storeId, setStoreId] = useState<string | null>(null);
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
            } else if (eventData.msg == "Order Picked" && data) {
                const newData = data.filter((order: any) => {
                    console.log(order.id);
                    return order.id != eventData.order.id;
                });
                console.log(eventData.order.id);
                setData(newData);
                console.log(data);
            } else if (eventData.msg == "Order Unpicked") {
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
                <Button
                    variant="default"
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
                </Button>
                <Button
                    variant="outline"
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
                </Button>
            </>
        );
    };
    if (!pickerId && pickerOptions) {
        return (
            <Select
                onValueChange={(value) => {
                    const [picker, store] = value.split("|");
                    setPickerId(picker);
                    setStoreId(store);
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select User"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {pickerOptions.map((picker: any, index: number) => {
                        return (
                            <SelectItem
                                value={picker.id + "|" + picker.stores[0].id}
                                key={index}
                            >
                                {picker.name}, {picker.stores[0].name}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        );
    }
    if (currentOrder) {
        return <>{orderPage(currentOrder)}</>;
    } else if (data) {
        return (
            <>
                <Button
                    onClick={() => {
                        setPickerOptions(null);
                        setData([]);
                        setPickerId(null);
                        setStoreId(null);
                    }}
                >
                    Log out
                </Button>
                <div>{currentOrder}</div>
                <ul>{orderList()}</ul>
            </>
        );
    } else {
        return <>Loading</>;
    }
}

export default WHApp;
