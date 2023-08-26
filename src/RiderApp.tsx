import { useEffect, useState } from "react";
import {
    completeOrder,
    getOrders,
    assignOrder,
    unassignOrder,
    cancelOrder,
    startOrder,
} from "./helperFunctions/orderFunctions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "./components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Switch } from "./components/ui/switch";

function RiderApp() {
    const [riderId, setRiderId] = useState<string | null>(null);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [riderOptions, setRiderOptions] = useState<any>(null);
    const [orderList, setOrderList] = useState<any[] | null>(null);
    const [currentOrder, setCurrentOrder] = useState<any | null>(null);
    const [onDuty, setOnDuty] = useState("OFF DUTY");

    useEffect(() => {
        const getData = async () => {
            let res = await fetch(`http://localhost:8080/stores`);
            const stores = await res.json();
            res = await fetch(`http://localhost:8080/riders`);
            const riders = await res.json();

            setRiderOptions({ stores, riders });
        };

        getData();
    }, []);

    useEffect(() => {
        if (storeId) {
            const fetchData = async () => {
                const orders = await getOrders({
                    storeId: storeId,
                    status: "READY",
                });
                setOrderList(orders);
            };
            fetchData();
        }
    }, [storeId]);

    return riderId == null || storeId == null ? (
        riderOptions == null ? (
            <>Loading...</>
        ) : (
            <>
                <Select
                    onValueChange={(value) => {
                        setStoreId(value);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Store"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {riderOptions.stores.map((store: any) => {
                            return (
                                <SelectItem
                                    value={store.id}
                                    key={store.id}
                                    onClick={() => {
                                        setStoreId(store.id);
                                    }}
                                >
                                    {store.name}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
                <Select
                    onValueChange={(value) => {
                        const [id, status] = value.split("|");
                        setRiderId(id);
                        setOnDuty(status);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Rider"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {riderOptions.riders.map((rider: any) => {
                            return (
                                <SelectItem
                                    value={rider.id + "|" + rider.status}
                                    key={rider.id}
                                    onClick={() => {
                                        setRiderId(rider.id);
                                    }}
                                >
                                    {rider.name}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </>
        )
    ) : currentOrder ? (
        <div>
            <button
                onClick={async () => {
                    await unassignOrder(currentOrder.id);
                    const orders = await getOrders({
                        storeId: storeId,
                        status: "READY",
                    });
                    setOrderList(orders);
                    setCurrentOrder(null);
                }}
            >
                Back
            </button>
            <p>{currentOrder.id}</p>
            <p>{currentOrder.customer.name}</p>
            <p>{currentOrder.address.line1}</p>
            <p>{currentOrder.status}</p>
            <button
                onClick={async () => {
                    const order = await startOrder(currentOrder.id);
                    setCurrentOrder(order);
                }}
            >
                Start
            </button>
            <button
                onClick={async () => {
                    await completeOrder(currentOrder.id);
                    const orders = await getOrders({
                        storeId: storeId,
                        status: "READY",
                    });
                    setOrderList(orders);
                    setCurrentOrder(null);
                }}
            >
                Complete
            </button>
            <button
                onClick={async () => {
                    await cancelOrder(currentOrder.id);
                    const orders = await getOrders({
                        storeId: storeId,
                        status: "READY",
                    });
                    setOrderList(orders);
                    setCurrentOrder(null);
                }}
            >
                Cancel
            </button>
        </div>
    ) : orderList == null ? (
        <>Loading... </>
    ) : onDuty == "ON_DUTY" ? (
        <>
            <Switch
                checked={onDuty == "ON_DUTY"}
                onCheckedChange={() => {
                    setOnDuty("OFF_DUTY");
                }}
            >
                On Duty
            </Switch>
            <ul>
                {orderList.map((order) => {
                    return (
                        <li
                            key={order.id}
                            onClick={async () => {
                                const assignedOrder = await assignOrder(
                                    order.id,
                                    riderId
                                );
                                setCurrentOrder(assignedOrder);
                            }}
                        >
                            <p>{order.id}</p>
                            <p>{order.customer.name}</p>
                            <p>{order.status}</p>
                        </li>
                    );
                })}
            </ul>
        </>
    ) : (
        <>
            <Switch
                checked={onDuty == "ON_DUTY"}
                onCheckedChange={() => {
                    setOnDuty("ON_DUTY");
                }}
            />
        </>
    );
}

export default RiderApp;
