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
import {
    assignOrder,
    completeOrder,
    getOrders,
} from "./helperFunctions/orderFunctions";
import { Dialog, DialogTrigger, DialogContent } from "./components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { getRiders } from "./helperFunctions/riderFunctions";
import { get } from "http";

type OrderStatus =
    | "NEW"
    | "PROCESSING"
    | "READY"
    | "ASSIGNED"
    | "DELIVERING"
    | "COMPLETE"
    | "CANCELLED";

type OrderDetail = {
    id: string;
    quantity: number;
    productId: string;
};

type Order = {
    id: string;
    storeId: string;
    store: {
        id: string;
        name: string;
    };
    riderId: string;
    pickerId: string;
    customerId: string;
    rider: {
        id: string;
        name: string;
    };
    picker: {
        id: string;
        name: string;
    };
    customer: {
        id: string;
        name: string;
    };
    createdOn: string;
    pickedOn: string;
    confirmedOn: string;
    assignedOn: string;
    startedOn: string;
    completedOn: string;

    addressId: string;
    address: {
        id: string;
        line1: string;
    };
    status: OrderStatus;
    orderDetails: OrderDetail[];
};

type User = {
    id: string;
    name: string;
    role: Role;
    createdOn: string;
};

type Role = "PICKER" | "SUPERVISOR" | "MANAGER" | "AREA_MANAGER" | "ADMIN";

type Rider = {
    id: string;
    name: string;
    storeId: string;
    store: {
        id: string;
        name: string;
    };
    status: RiderStatus;
};

type RiderStatus = "ON_DUTY" | "OFF_DUTY" | "INACTIVE";

type Store = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
};

type InventoryEntry = {
    id: string;
    quantity: number;
    productId: string;
    product: {
        id: string;
        name: string;
    };
};
async function confirmOrder(orderId: string) {
    const res = await fetch(`http://localhost:8080/orders/${orderId}/confirm`, {
        method: "POST",
    });
    const order = await res.json();
    return order;
}

function UserPage(userData: User[]) {
    return (
        <>
            {userData.map((user) => {
                return (
                    <div>
                        {user.name}, {user.role}
                    </div>
                );
            })}
        </>
    );
}

function RiderPage(riderData: Rider[]) {
    return (
        <>
            {riderData.map((rider) => {
                return <div>{rider.name}</div>;
            })}
        </>
    );
}

function StorePage(storeData: Store[]) {
    console.log(storeData);
    return (
        <>
            {storeData.map((store) => {
                return <div>{store.name}</div>;
            })}
        </>
    );
}

function InventoryPage(inventoryData: InventoryEntry[]) {
    return (
        <>
            <Table>
                <TableCaption>List of Products</TableCaption>
                <TableHeader>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                </TableHeader>
                <TableBody>
                    {inventoryData.map((entry) => {
                        return (
                            <TableRow key={entry.id}>
                                <TableCell>{entry.product.name}</TableCell>
                                <TableCell>{entry.quantity}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}

function OrderList(
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
                                        (acc: number, detail) =>
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

type OrderData = {
    items: Order[];
    recordsPerPage: number;
    pageNumber: number;
    totalPages: number;
    totalRecords: number;
};

type OrderFilters = {
    store: Record<string, Store & boolean>;
    status: Record<OrderStatus, boolean>;
    rider: Record<string, Rider & boolean>;
    createdBefore?: string;
    createdAfter?: string;
};

type OrderSorting = {
    orderBy: "asc" | "desc";
};

function Portal() {
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [orderFilters, setOrderFilters] = useState<OrderFilters>({
        store: {},
        status: {
            NEW: false,
            PROCESSING: false,
            READY: false,
            ASSIGNED: false,
            DELIVERING: false,
            COMPLETE: false,
            CANCELLED: false,
        },
        rider: {},
    });
    const [orderSorting, setOrderSorting] = useState<OrderSorting>({
        orderBy: "desc",
    });
    const [orderSearchQuery, setOrderSearchQuery] = useState<string>("");
    const [storeId, setStoreId] = useState<string | null>(null);
    const [storeOptions, setStoreOptions] = useState<Store[]>([]);
    const [riderOptions, setRiderOptions] = useState<Rider[]>([]);
    const [inventoryData, setInventoryData] = useState<InventoryEntry[]>([]);
    const [userData, setUserData] = useState<User[]>([]);
    const [riderData, setRiderData] = useState<Rider[]>([]);
    const [storeData, setStoreData] = useState<Store[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
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
            const getInventoryData = async () => {
                const res = await fetch(
                    `http://localhost:8080/inventory?` +
                        new URLSearchParams({ storeId: storeId })
                );
                const inventory = await res.json();
                setInventoryData(inventory);
            };
            const getUserData = async () => {
                const res = await fetch(`http://localhost:8080/users`);
                const users = await res.json();
                setUserData(users);
            };
            const getRiderData = async () => {
                const riders = await getRiders({ statuses: ["ON_DUTY"] });
                setRiderData(riders);
            };
            const getStoreData = async () => {
                const res = await fetch(`http://localhost:8080/stores`);
                const stores = await res.json();
                setStoreData(stores);
            };
            getOrderData();
            getInventoryData();
            getUserData();
            getRiderData();
            getStoreData();
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
                {storeOptions.map((store) => {
                    return (
                        <SelectItem value={store.id}>{store.name}</SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    ) : currentOrder ? (
        <>
            <Button
                onClick={() => {
                    setCurrentOrder(null);
                }}
            >
                Back
            </Button>
            <div>{currentOrder.id}</div>
        </>
    ) : orderData && storeData ? (
        <>
            <Button
                onClick={() => {
                    setStoreId(null);
                }}
            >
                Back
            </Button>
            <Tabs defaultValue="Order List" className="">
                <TabsList>
                    <TabsTrigger value="Order List">Order List</TabsTrigger>
                    <TabsTrigger value="Inventory">Inventory</TabsTrigger>
                    <TabsTrigger value="Riders">Riders</TabsTrigger>
                    <TabsTrigger value="Users">Users</TabsTrigger>
                    <TabsTrigger value="Stores">Stores</TabsTrigger>
                    <TabsTrigger value="Incidents">Incidents</TabsTrigger>
                </TabsList>
                <TabsContent value="Order List">
                    {OrderList(
                        orderData,
                        setOrderData,
                        riderOptions,
                        setRiderOptions,
                        setCurrentOrder,
                        storeId
                    )}
                </TabsContent>
                <TabsContent value="Inventory">
                    {InventoryPage(inventoryData)}
                </TabsContent>
                <TabsContent value="Users">
                    <>Pabe to view and edit users{UserPage(userData)}</>
                </TabsContent>
                <TabsContent value="Riders">
                    <>Page to view and edit riders{RiderPage(riderData)}</>
                </TabsContent>
                <TabsContent value="Stores">{StorePage(storeData)}</TabsContent>
                <TabsContent value="Incidents">
                    Page to view and edit incidents
                </TabsContent>
            </Tabs>
        </>
    ) : (
        <>Loading...</>
    );
}

export default Portal;
