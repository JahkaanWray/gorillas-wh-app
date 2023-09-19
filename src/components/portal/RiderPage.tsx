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

export function RiderPage(riderData: RiderData | null) {
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
