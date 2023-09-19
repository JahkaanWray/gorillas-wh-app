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
import { OrderPage } from "./components/portal/OrderPage";
import { UserPage } from "./components/portal/UserPage";
import { InventoryPage } from "./components/portal/inventoryPage";
import { StorePage } from "./components/portal/StorePage";
import { RiderPage } from "./components/portal/RiderPage";

function Portal() {
    const [storeId, setStoreId] = useState<string | null>(null);
    const [storeOptions, setStoreOptions] = useState<Store[]>([]);
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
    ) : (
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
                    <OrderPage storeId={storeId}></OrderPage>
                </TabsContent>
                <TabsContent value="Inventory">
                    <InventoryPage></InventoryPage>
                </TabsContent>
                <TabsContent value="Users">
                    <UserPage />
                </TabsContent>
                <TabsContent value="Riders">
                    <RiderPage />
                </TabsContent>
                <TabsContent value="Stores">
                    <StorePage />
                </TabsContent>
                <TabsContent value="Incidents">
                    Page to view and edit incidents
                </TabsContent>
            </Tabs>
        </>
    );
}

export default Portal;
