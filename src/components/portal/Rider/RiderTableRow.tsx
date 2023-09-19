import { Rider } from "@/src/lib/types";
import { Button } from "../../ui/button";
import { TableCell, TableRow } from "../../ui/table";

export function RiderTableRow({ rider }: { rider: Rider }) {
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
}
