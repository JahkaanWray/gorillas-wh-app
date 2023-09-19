import { InventoryEntry } from "@/src/lib/types";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { useState } from "react";
import { editInventoryEntry } from "../../../helperFunctions/inventoryFunctions";

export function InventoryEditForm({ entry }: { entry: InventoryEntry }) {
    const [inventoryEditData, setInventoryEditData] = useState<{
        quantity: number;
        published: boolean;
    }>({
        quantity: entry.quantity,
        published: entry.published,
    });
    return (
        <Sheet>
            <SheetTrigger>
                <Button>Edit</Button>
            </SheetTrigger>
            <SheetContent>
                <Label>Quantity</Label>
                <Input
                    type="number"
                    value={inventoryEditData.quantity}
                    onChange={(e) => {
                        setInventoryEditData({
                            quantity: parseInt(e.target.value),
                            published: inventoryEditData.published,
                        });
                    }}
                ></Input>
                <Checkbox
                    checked={inventoryEditData.published}
                    onCheckedChange={(e) => {
                        setInventoryEditData({
                            quantity: inventoryEditData.quantity,
                            published: e.valueOf() as boolean,
                        });
                    }}
                ></Checkbox>
                <Label>Published</Label>
                <Button
                    onClick={async () => {
                        const requestBody = {};
                        await editInventoryEntry({
                            storeId: entry.store.id,
                            productId: entry.productId,
                            ...inventoryEditData,
                        });
                    }}
                >
                    Confirm
                </Button>
            </SheetContent>
        </Sheet>
    );
}
