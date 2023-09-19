import { RiderData } from "@/src/lib/types";
import { Button } from "../../ui/button";
import {
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Table,
} from "../../ui/table";
import { useEffect, useState } from "react";
import { getRiders } from "../../../helperFunctions/riderFunctions";
import { RiderTable } from "./RiderTable";
import { RiderPageLengthSelector } from "./RiderPageLengthSelector";
import { RiderPageSelector } from "./RiderPageSelector";
import { RiderSortAndFilterSelector } from "./RiderSortAndFilterSelector";

function emptyRiderData(): RiderData {
    return {
        items: [],
        recordsPerPage: 50,
        pageNumber: 1,
        totalPages: 1,
        totalRecords: 0,
    };
}
export function RiderPage() {
    const [riderData, setRiderData] = useState<RiderData>(emptyRiderData());

    useEffect(() => {
        const getRiderData = async () => {
            const riders = await getRiders({});
            setRiderData(riders);
        };
        getRiderData();
    }, []);
    return (
        <>
            <RiderSortAndFilterSelector />
            <RiderTable riderData={riderData} />
            <RiderPageLengthSelector />
            <RiderPageSelector />
        </>
    );
}
