import { Store } from "@/src/lib/types";
import { Button } from "../ui/button";
import {
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Table,
} from "../ui/table";
import { useEffect, useState } from "react";
import { getStores } from "../../helperFunctions/storeFunctions";

export function StorePage() {
    const [storeData, setStoreData] = useState<Store[]>([]);

    useEffect(() => {
        const getStoreData = async () => {
            const stores = await getStores({});
            setStoreData(stores);
        };
        getStoreData();
    }, []);
    return (
        <>
            <Table>
                <TableHeader>
                    <TableHead>Name</TableHead>
                    <TableHead> Latitude</TableHead>
                    <TableHead>Longitude</TableHead>
                    <TableHead></TableHead>
                </TableHeader>
                <TableBody>
                    {storeData.map((store) => {
                        return (
                            <TableRow>
                                <TableCell>{store.name}</TableCell>
                                <TableCell>{store.latitude}</TableCell>
                                <TableCell>{store.longitude}</TableCell>
                                <TableCell>
                                    <Button>Edit Store</Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}
