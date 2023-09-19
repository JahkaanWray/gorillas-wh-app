import { OrderData } from "@/src/lib/types";
import { getOrders } from "../../helperFunctions/orderFunctions";
import { Button } from "../ui/button";

export function OrderPageSelector({
    storeId,
    orderData,
    setOrderData,
}: {
    storeId: string;
    orderData: OrderData;
    setOrderData: Function;
}) {
    return (
        <>
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
