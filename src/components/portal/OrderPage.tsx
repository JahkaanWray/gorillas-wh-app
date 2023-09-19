import { Order, OrderData, Rider } from "@/src/lib/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { getOrders } from "../../helperFunctions/orderFunctions";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { OrderTable } from "../portal/OrderTable";

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
    return currentOrder ? (
        <>
            <Button onClick={() => setCurrentOrder(null)}>Back</Button>
            <div>{currentOrder.id}</div>
        </>
    ) : (
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
            <OrderTable
                storeId={storeId}
                orderData={orderData}
                setOrderData={setOrderData}
                riderOptions={riderOptions}
                setRiderOptions={setRiderOptions}
                setCurrentOrder={setCurrentOrder}
            ></OrderTable>
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
