import { Order, OrderData, Rider } from "@/src/lib/types";
import { getOrders } from "../../helperFunctions/orderFunctions";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { OrderTable } from "./OrderTable";
import { OrderPageLengthSelector } from "./OrderPageLengthSelector";
import { OrderSortAndFilterSelector } from "./OrderSortAndFilterSelector";
import { OrderPageSelector } from "./OrderPageSelector";

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
            <OrderSortAndFilterSelector />
            <OrderTable
                orderData={orderData}
                setOrderData={setOrderData}
                riderOptions={riderOptions}
                setRiderOptions={setRiderOptions}
                setCurrentOrder={setCurrentOrder}
            ></OrderTable>
            <OrderPageLengthSelector />
            <OrderPageSelector
                storeId={storeId}
                orderData={orderData}
                setOrderData={setOrderData}
            />
        </>
    );
}
