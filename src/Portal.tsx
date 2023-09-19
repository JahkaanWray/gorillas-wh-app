import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import {
    Select,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from "./components/ui/select";
import { getOrders } from "./helperFunctions/orderFunctions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { getRiders } from "./helperFunctions/riderFunctions";
import { getInventoryEntries } from "./helperFunctions/inventoryFunctions";
import { getUsers } from "./helperFunctions/userFunctions";
import {
    InventoryData,
    Order,
    OrderData,
    OrderFilters,
    OrderSorting,
    Rider,
    RiderData,
    Store,
    UserData,
} from "./lib/types";
import { OrderList } from "./components/portal/OrderTable";
import { UserPage } from "./components/portal/UserPage";
import { InventoryPage } from "./components/portal/inventoryPage";
import { StorePage } from "./components/portal/StorePage";
import { RiderPage } from "./components/portal/RiderPage";

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
    const [inventoryData, setInventoryData] = useState<InventoryData | null>(
        null
    );
    const [userData, setUserData] = useState<UserData | null>(null);
    const [riderData, setRiderData] = useState<RiderData | null>(null);
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
                const inventory = await getInventoryEntries({});
                setInventoryData(inventory);
            };
            const getUserData = async () => {
                const users = await getUsers({});
                setUserData(users);
            };
            const getRiderData = async () => {
                const riders = await getRiders({});
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
                    {inventoryData ? (
                        InventoryPage(inventoryData)
                    ) : (
                        <>Loading...</>
                    )}
                </TabsContent>
                <TabsContent value="Users">
                    {userData ? UserPage(userData) : <>Loading...</>}
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
