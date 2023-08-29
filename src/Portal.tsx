import { Table } from "./components/ui/table";
import { useEffect, useState } from "react";
import {
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./components/ui/table";
import { Button } from "./components/ui/button";
import {
    Select,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from "./components/ui/select";

async function confirmOrder(orderId: string) {
    const res = await fetch(`http://localhost:8080/orders/${orderId}/confirm`, {
        method: "POST",
    });
    const order = await res.json();
    return order;
}

function Portal() {
    const [orderData, setOrderData] = useState<object[] | null>(null);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [storeOptions, setStoreOptions] = useState<any>(null);

    useEffect(() => {
        const getData = async () => {
            const res = await fetch("http://localhost:8080/stores");
            const data = await res.json();
            setStoreOptions(data);
        };
        getData();
    }, []);

    useEffect(() => {
        if (storeId) {
            const getData = async () => {
                const res = await fetch(
                    "http://localhost:8080/orders?" +
                        new URLSearchParams({ storeId: storeId })
                );
                const orders = await res.json();
                setOrderData(orders);
            };
            getData();
        }
    }, [storeId]);

    return storeOptions == null ? (
        <>Loading...</>
    ) : storeId == null ? (
        <Select
            onValueChange={(value) => {
                setStoreId(value);
            }}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select Store"></SelectValue>
            </SelectTrigger>
            <SelectContent>
                {storeOptions.map((store: any) => {
                    return (
                        <SelectItem value={store.id}>{store.name}</SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    ) : orderData ? (
        <>
            <Button
                onClick={() => {
                    setStoreId(null);
                }}
            >
                Back
            </Button>
            <Table>
                <TableCaption>List of Orders</TableCaption>
                <TableHeader>
                    <TableHead>Customer</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                </TableHeader>
                <TableBody>
                    {orderData.map((order: any) => {
                        console.log(order);
                        return (
                            <TableRow key={order.id}>
                                <TableCell>{order.customer.name}</TableCell>
                                <TableCell>{order.address.line1}</TableCell>
                                <TableCell>
                                    {order.orderDetails.reduce(
                                        (acc: number, detail: any) =>
                                            acc + detail.quantity,
                                        0
                                    )}
                                </TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>
                                    {order.status == "NEW" ? (
                                        <Button>View Order</Button>
                                    ) : order.status == "PROCESSING" ? (
                                        <Button
                                            onClick={async () => {
                                                const newOrder =
                                                    await confirmOrder(
                                                        order.id
                                                    );
                                                const oldData = [...orderData];
                                                const newData = oldData.filter(
                                                    (order: any) => {
                                                        return true;
                                                    }
                                                );
                                                setOrderData([
                                                    newOrder,
                                                    ...newData,
                                                ]);
                                            }}
                                        >
                                            Confirm
                                        </Button>
                                    ) : order.status == "READY" ? (
                                        <Button>Assign</Button>
                                    ) : order.status == "COMPLETE" ? (
                                        <></>
                                    ) : (
                                        <Button>Complete</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    ) : (
        <>Loading...</>
    );
}

export default Portal;
