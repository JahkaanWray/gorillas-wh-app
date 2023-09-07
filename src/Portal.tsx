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
import { assignOrder, completeOrder } from "./helperFunctions/orderFunctions";
import { Dialog, DialogTrigger, DialogContent } from "./components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { getRiders } from "./helperFunctions/riderFunctions";

async function confirmOrder(orderId: string) {
    const res = await fetch(`http://localhost:8080/orders/${orderId}/confirm`, {
        method: "POST",
    });
    const order = await res.json();
    return order;
}

function OrderList(
    orderData: any,
    setOrderData: Function,
    riderOptions: any,
    setRiderOptions: Function
) {
    return (
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
                                            const newOrder = await confirmOrder(
                                                order.id
                                            );
                                            const oldData = [...orderData];
                                            const newData = oldData.map(
                                                (order: any) => {
                                                    return order.id ==
                                                        newOrder.id
                                                        ? newOrder
                                                        : order;
                                                }
                                            );
                                            const newState = [
                                                newOrder,
                                                ...newData,
                                            ];
                                            setOrderData(newData);
                                        }}
                                    >
                                        Confirm
                                    </Button>
                                ) : order.status == "READY" ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                onClick={async () => {
                                                    const riders =
                                                        await getRiders(
                                                            "ON_DUTY"
                                                        );
                                                    setRiderOptions(riders);
                                                }}
                                            >
                                                Assign
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            {riderOptions ? (
                                                <div>
                                                    {riderOptions.map(
                                                        (rider: any) => {
                                                            return (
                                                                <span>
                                                                    <div>
                                                                        {
                                                                            rider.name
                                                                        }
                                                                    </div>
                                                                    <Button
                                                                        onClick={async () => {
                                                                            const newOrder =
                                                                                await assignOrder(
                                                                                    order.id,
                                                                                    rider.id
                                                                                );
                                                                            const oldData =
                                                                                [
                                                                                    ...orderData,
                                                                                ];
                                                                            const newData =
                                                                                oldData.map(
                                                                                    (
                                                                                        order: any
                                                                                    ) => {
                                                                                        return order.id ==
                                                                                            newOrder.id
                                                                                            ? newOrder
                                                                                            : order;
                                                                                    }
                                                                                );
                                                                            setOrderData(
                                                                                newData
                                                                            );
                                                                            setRiderOptions(
                                                                                null
                                                                            );
                                                                        }}
                                                                    >
                                                                        Assign
                                                                    </Button>
                                                                </span>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            ) : (
                                                <div>List of Riders</div>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                ) : order.status == "ASSIGNED" ||
                                  order.status == "DELIVERING" ? (
                                    <Button
                                        onClick={async () => {
                                            const newOrder =
                                                await completeOrder(order.id);
                                            const oldData = [...orderData];
                                            const newData = oldData.map(
                                                (order: any) => {
                                                    return order.id ==
                                                        newOrder.id
                                                        ? newOrder
                                                        : order;
                                                }
                                            );
                                            setOrderData(newData);
                                        }}
                                    >
                                        Complete
                                    </Button>
                                ) : order.status == "COMPLETE" ? (
                                    <>---</>
                                ) : (
                                    <>---</>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

function Portal() {
    const [orderData, setOrderData] = useState<object[] | null>(null);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [storeOptions, setStoreOptions] = useState<any>(null);
    const [riderOptions, setRiderOptions] = useState<any>(null);
    const [tab, setTab] = useState("Order List");

    const tabs = ["Order List", "Order Map", "Inventory", "Riders"];

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
            <Tabs defaultValue="account" className="">
                <TabsList>
                    <TabsTrigger value="Order List">Order List</TabsTrigger>
                    <TabsTrigger value="Inventory">Inventory</TabsTrigger>
                </TabsList>
                <TabsContent value="Order List">
                    {OrderList(
                        orderData,
                        setOrderData,
                        riderOptions,
                        setRiderOptions
                    )}
                </TabsContent>
                <TabsContent value="inventory">
                    Change your password here.
                </TabsContent>
            </Tabs>
        </>
    ) : (
        <>Loading...</>
    );
}

export default Portal;
