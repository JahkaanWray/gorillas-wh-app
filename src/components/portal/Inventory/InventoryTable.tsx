import { InventoryData } from "@/src/lib/types";
import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
} from "../../ui/table";
import { InventoryTableRow } from "./InventoryTableRow";

export function InventoryTable({
    inventoryData,
}: {
    inventoryData: InventoryData;
}) {
    return (
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
                    return <InventoryTableRow entry={entry} />;
                })}
            </TableBody>
        </Table>
    );
}
