import { InventoryEntry } from "@/src/lib/types";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { SheetTrigger, SheetContent, Sheet } from "../../ui/sheet";
import { TableRow, TableCell } from "../../ui/table";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { InventoryEditForm } from "./InventoryEditForm";

export function InventoryTableRow({ entry }: { entry: InventoryEntry }) {
    return (
        <TableRow key={entry.id}>
            <TableCell>{entry.store.name}</TableCell>
            <TableCell>{entry.product.name}</TableCell>
            <TableCell>{entry.quantity}</TableCell>
            <TableCell>{entry.published ? "TRUE" : "FALSE"}</TableCell>
            <TableCell>
                <InventoryEditForm entry={entry} />
            </TableCell>
        </TableRow>
    );
}
