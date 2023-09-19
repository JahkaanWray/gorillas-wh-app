import { OrderData, Rider } from "@/src/lib/types";
import {
    TableCaption,
    TableHeader,
    TableHead,
    TableBody,
    Table,
} from "../ui/table";
import { OrderTableRow } from "./OrderTableRow";

export function sum(a: number, b: number) {
    return a + b;
}

export function OrderTable({
    orderData,
    setOrderData,
    riderOptions,
    setRiderOptions,
    setCurrentOrder,
}: {
    orderData: OrderData;
    setOrderData: Function;
    riderOptions: Rider[];
    setRiderOptions: Function;
    setCurrentOrder: Function;
}) {
    return (
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
                    return (
                        <OrderTableRow
                            order={order}
                            orderData={orderData}
                            setOrderData={setOrderData}
                            riderOptions={riderOptions}
                            setRiderOptions={setRiderOptions}
                            setCurrentOrder={setCurrentOrder}
                        ></OrderTableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
