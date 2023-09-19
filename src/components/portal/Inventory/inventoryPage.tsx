import { InventoryData } from "@/src/lib/types";
import { useEffect, useState } from "react";
import { getInventoryEntries } from "../../../helperFunctions/inventoryFunctions";
import { InventoryTable } from "./InventoryTable";
import { InventorySortAndFilterSelector } from "./InventorySortAndFilterSelector";
import { InventoryPageLengthSelector } from "./InventoryPageLengthSelector";
import { InventoryPageSelector } from "./InventoryPageSelector";

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
            <InventorySortAndFilterSelector />
            <InventoryTable inventoryData={inventoryData} />
            <InventoryPageLengthSelector />
            <InventoryPageSelector />
        </>
    );
}
