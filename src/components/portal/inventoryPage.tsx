import { InventoryData } from "@/src/lib/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SheetTrigger, SheetContent, Sheet } from "../ui/sheet";
import {
    TableCaption,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Table,
} from "../ui/table";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";
import { getInventoryEntries } from "../../helperFunctions/inventoryFunctions";

function emptyInventoryData(): InventoryData {
    return {
        items: [],
        recordsPerPage: 50,
        pageNumber: 1,
        totalPages: 1,
        totalRecords: 0,
    };
}
export function InventoryPage() {
    const [inventoryData, setInventoryData] = useState<InventoryData>(
        emptyInventoryData()
    );

    useEffect(() => {
        const getInventoryData = async () => {
            const inventory = await getInventoryEntries({});
            setInventoryData(inventory);
        };
        getInventoryData();
    }, []);
    return (
        <>
            <Table>
                <TableCaption>List of Products</TableCaption>
                <TableHeader>
                    <TableHead>Store</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead></TableHead>
                </TableHeader>
                <TableBody>
                    {inventoryData.items.map((entry) => {
                        return (
                            <TableRow key={entry.id}>
                                <TableCell>{entry.store.name}</TableCell>
                                <TableCell>{entry.product.name}</TableCell>
                                <TableCell>{entry.quantity}</TableCell>
                                <TableCell>
                                    {entry.published ? "TRUE" : "FALSE"}
                                </TableCell>
                                <TableCell>
                                    <Sheet>
                                        <SheetTrigger>
                                            <Button>Edit</Button>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <Label>Quantity</Label>
                                            <Input
                                                type="text"
                                                placeholder={entry.quantity.toString()}
                                            ></Input>
                                            <Checkbox
                                                checked={entry.published}
                                            ></Checkbox>
                                            <Label>Published</Label>
                                            <Button>Confirm</Button>
                                        </SheetContent>
                                    </Sheet>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}
