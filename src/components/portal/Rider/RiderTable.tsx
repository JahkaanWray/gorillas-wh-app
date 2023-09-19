import { RiderData } from "@/src/lib/types";
import { Button } from "../../ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { RiderTableRow } from "./RiderTableRow";

export function RiderTable({ riderData }: { riderData: RiderData }) {
    return (
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
                    return <RiderTableRow rider={rider} />;
                })}
            </TableBody>
        </Table>
    );
}
