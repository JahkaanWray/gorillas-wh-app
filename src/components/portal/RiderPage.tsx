import { RiderData } from "@/src/lib/types";
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
import { getRiders } from "../../helperFunctions/riderFunctions";

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
    return riderData ? (
        <>
            <Table>
                <TableHeader>
                    <TableHead>Name</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                </TableHeader>
                <TableBody>
                    {riderData.items.map((rider) => {
                        return (
                            <TableRow>
                                <TableCell>{rider.name}</TableCell>
                                <TableCell>{rider.store.name}</TableCell>
                                <TableCell>{rider.status}</TableCell>
                                <TableCell>
                                    {rider.status === "ON_DUTY" ? (
                                        <Button>Off Duty</Button>
                                    ) : (
                                        <Button>On Duty</Button>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button>Edit Rider</Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            {riderData.items.map((rider) => {
                return <div>{rider.name}</div>;
            })}
        </>
    ) : (
        <>Loading...</>
    );
}
