import {
    confirmOrder,
    assignOrder,
    completeOrder,
} from "../../helperFunctions/orderFunctions";
import { getRiders } from "../../helperFunctions/riderFunctions";
import { Order, OrderData, OrderDetail, Rider } from "@/src/lib/types";
import { Button } from "../ui/button";
import { TableRow, TableCell } from "../ui/table";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export function OrderTableRow({
    order,
    orderData,
    setOrderData,
    riderOptions,
    setRiderOptions,
    setCurrentOrder,
}: {
    order: Order;
    orderData: OrderData;
    setOrderData: Function;
    riderOptions: Rider[];
    setRiderOptions: Function;
    setCurrentOrder: Function;
}) {
    return (
        <>
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
                <TableCell>{order.rider ? order.rider.name : "---"}</TableCell>
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
                                const newOrder = await confirmOrder(order.id);
                                const oldState = {
                                    ...orderData,
                                };
                                const oldOrders = [...orderData.items];
                                const newOrders = oldOrders.map((order) => {
                                    return order.id == newOrder.id
                                        ? newOrder
                                        : order;
                                });
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
                                        const riders = await getRiders({
                                            statuses: ["ON_DUTY"],
                                        });
                                        setRiderOptions(riders.items);
                                    }}
                                >
                                    Assign
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                {riderOptions ? (
                                    <div>
                                        {riderOptions.map((rider) => {
                                            return (
                                                <span>
                                                    <div>{rider.name}</div>
                                                    <Button
                                                        onClick={async () => {
                                                            const newOrder =
                                                                await assignOrder(
                                                                    order.id,
                                                                    rider.id
                                                                );
                                                            const newState = {
                                                                ...orderData,
                                                            };
                                                            const oldData = [
                                                                ...orderData.items,
                                                            ];
                                                            const newData =
                                                                oldData.map(
                                                                    (order) => {
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
                                                            setRiderOptions([]);
                                                        }}
                                                    >
                                                        Assign
                                                    </Button>
                                                </span>
                                            );
                                        })}
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
                                const newOrder = await completeOrder(order.id);
                                const newState = {
                                    ...orderData,
                                };
                                const oldData = [...orderData.items];
                                const newData = oldData.map((order) => {
                                    return order.id == newOrder.id
                                        ? newOrder
                                        : order;
                                });
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
            ;
        </>
    );
}
