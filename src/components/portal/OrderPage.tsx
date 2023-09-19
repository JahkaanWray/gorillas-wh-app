import { Order, OrderData, OrderDetail, Rider } from "@/src/lib/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    confirmOrder,
    assignOrder,
    completeOrder,
    getOrders,
} from "../../helperFunctions/orderFunctions";
import { getRiders } from "../../helperFunctions/riderFunctions";
import { Button } from "../ui/button";
import {
    TableCaption,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Table,
} from "../ui/table";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

function emptyOrderData(): OrderData {
    return {
        items: [],
        recordsPerPage: 50,
        pageNumber: 1,
        totalPages: 1,
        totalRecords: 0,
    };
}

export function OrderPage({ storeId }: { storeId: string }) {
    const [orderData, setOrderData] = useState<OrderData>(emptyOrderData());
    const [riderOptions, setRiderOptions] = useState<Rider[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    useEffect(() => {
        const getOrderData = async () => {
            const orders = await getOrders({
                storeIds: [storeId],
                recordsPerPage: 5,
                pageNumber: 1,
                sortBy: "createdOn",
                orderBy: "desc",
            });
            setOrderData(orders);
        };
        getOrderData();
    }, []);
    return (
        <>
            <Select>
                <SelectTrigger>
                    <SelectValue>Sort By</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="createdOn">Created On</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger>
                    <SelectValue>Order By</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="asc">ASC</SelectItem>
                    <SelectItem value="desc">DESC</SelectItem>
                </SelectContent>
            </Select>
            <Table>
                <TableCaption>List of Orders</TableCaption>
                <TableHeader>
                    <TableHead>Customer</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rider</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                </TableHeader>
                <TableBody>
                    {orderData.items.map((order) => {
                        console.log(order);
                        return (
                            <TableRow key={order.id}>
                                <TableCell>{order.customer.name}</TableCell>
                                <TableCell>{order.address.line1}</TableCell>
                                <TableCell>{order.store.name}</TableCell>
                                <TableCell>
                                    {order.orderDetails.reduce(
                                        (acc: number, detail: OrderDetail) =>
                                            acc + detail.quantity,
                                        0
                                    )}
                                </TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>
                                    {order.rider ? order.rider.name : "---"}
                                </TableCell>
                                <TableCell>{order.createdOn}</TableCell>
                                <TableCell>
                                    {order.status == "NEW" ? (
                                        <Button
                                            onClick={() => {
                                                setCurrentOrder(order);
                                            }}
                                        >
                                            View Order
                                        </Button>
                                    ) : order.status == "PROCESSING" ? (
                                        <Button
                                            onClick={async () => {
                                                const newOrder =
                                                    await confirmOrder(
                                                        order.id
                                                    );
                                                const oldState = {
                                                    ...orderData,
                                                };
                                                const oldOrders = [
                                                    ...orderData.items,
                                                ];
                                                const newOrders = oldOrders.map(
                                                    (order) => {
                                                        return order.id ==
                                                            newOrder.id
                                                            ? newOrder
                                                            : order;
                                                    }
                                                );
                                                oldState.items = newOrders;
                                                setOrderData(oldState);
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
                                                            await getRiders({
                                                                statuses: [
                                                                    "ON_DUTY",
                                                                ],
                                                            });
                                                        setRiderOptions(
                                                            riders.items
                                                        );
                                                    }}
                                                >
                                                    Assign
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                {riderOptions ? (
                                                    <div>
                                                        {riderOptions.map(
                                                            (rider) => {
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
                                                                                const newState =
                                                                                    {
                                                                                        ...orderData,
                                                                                    };
                                                                                const oldData =
                                                                                    [
                                                                                        ...orderData.items,
                                                                                    ];
                                                                                const newData =
                                                                                    oldData.map(
                                                                                        (
                                                                                            order
                                                                                        ) => {
                                                                                            return order.id ==
                                                                                                newOrder.id
                                                                                                ? newOrder
                                                                                                : order;
                                                                                        }
                                                                                    );
                                                                                newState.items =
                                                                                    newData;
                                                                                setOrderData(
                                                                                    newState
                                                                                );
                                                                                setRiderOptions(
                                                                                    []
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
                                                    await completeOrder(
                                                        order.id
                                                    );
                                                const newState = {
                                                    ...orderData,
                                                };
                                                const oldData = [
                                                    ...orderData.items,
                                                ];
                                                const newData = oldData.map(
                                                    (order) => {
                                                        return order.id ==
                                                            newOrder.id
                                                            ? newOrder
                                                            : order;
                                                    }
                                                );
                                                newState.items = newData;
                                                setOrderData(newState);
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
                                <TableCell></TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Select>
                <SelectTrigger>
                    <SelectValue></SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="75">75</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                </SelectContent>
            </Select>
            <span>
                <Button
                    onClick={async () => {
                        const orders = await getOrders({
                            storeIds: [storeId],
                            recordsPerPage: 5,
                            pageNumber: 1,
                            sortBy: "createdOn",
                            orderBy: "desc",
                        });
                        setOrderData(orders);
                    }}
                >
                    {"<<"}
                </Button>
                <Button
                    onClick={async () => {
                        const previousPage = Math.max(
                            1,
                            --orderData.pageNumber
                        );
                        const orders = await getOrders({
                            storeIds: [storeId],
                            recordsPerPage: 5,
                            pageNumber: previousPage,
                            sortBy: "createdOn",
                            orderBy: "desc",
                        });
                        setOrderData(orders);
                    }}
                >
                    {"<"}
                </Button>
                <span>
                    Page {orderData.pageNumber} of {orderData.totalPages}
                </span>
                <Button
                    onClick={async () => {
                        console.log(orderData.pageNumber + 1);
                        const nextPage = Math.min(
                            orderData.pageNumber + 1,
                            orderData.totalPages
                        );
                        const orders = await getOrders({
                            storeIds: [storeId],
                            recordsPerPage: 5,
                            pageNumber: nextPage,
                            sortBy: "createdOn",
                            orderBy: "desc",
                        });
                        setOrderData(orders);
                    }}
                >
                    {">"}
                </Button>
                <Button
                    onClick={async () => {
                        const orders = await getOrders({
                            storeIds: [storeId],
                            recordsPerPage: 5,
                            pageNumber: orderData.totalPages,
                            sortBy: "createdOn",
                            orderBy: "desc",
                        });
                        setOrderData(orders);
                    }}
                >
                    {">>"}
                </Button>
            </span>
        </>
    );
}
