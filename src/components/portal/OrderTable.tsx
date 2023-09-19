import { OrderData, OrderDetail, Rider } from "@/src/lib/types";
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
} from "@/src/helperFunctions/orderFunctions";
import { getRiders } from "@/src/helperFunctions/riderFunctions";
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";
import { Table } from "lucide-react";
import { Button } from "../ui/button";
import {
    TableCaption,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "../ui/table";

export function OrderList(
    orderData: OrderData,
    setOrderData: Function,
    riderOptions: Rider[],
    setRiderOptions: Function,
    setCurrentOrder: Function,
    storeId: string
) {
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
