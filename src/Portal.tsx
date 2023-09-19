import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import {
    Select,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Order, Store } from "./lib/types";
import { OrderPage } from "./components/portal/Order/OrderPage";
import { UserPage } from "./components/portal/UserPage";
import { InventoryPage } from "./components/portal/inventoryPage";
import { StorePage } from "./components/portal/StorePage";
import { RiderPage } from "./components/portal/RiderPage";
import { getStores } from "./helperFunctions/storeFunctions";

function Portal() {
    const [storeId, setStoreId] = useState<string | null>(null);
    const [storeOptions, setStoreOptions] = useState<Store[]>([]);
    const [tab, setTab] = useState("Order List");

    const tabs = ["Order List", "Order Map", "Inventory", "Riders"];

    useEffect(() => {
        const getData = async () => {
            const data = await getStores({});
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
