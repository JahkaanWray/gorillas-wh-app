import { Rider } from "@/src/lib/types";
import { Button } from "../../ui/button";
import { TableCell, TableRow } from "../../ui/table";
import {
    riderOffDuty,
    riderOnDuty,
} from "../../../helperFunctions/riderFunctions";

export function RiderTableRow({ rider }: { rider: Rider }) {
    return (
        <TableRow>
            <TableCell>{rider.name}</TableCell>
            <TableCell>{rider.store.name}</TableCell>
            <TableCell>{rider.status}</TableCell>
            <TableCell>
                {rider.status === "ON_DUTY" ? (
                    <Button
                        onClick={async () => {
                            const newRider = await riderOffDuty(rider.id);
                        }}
                    >
                        Off Duty
                    </Button>
                ) : (
                    <Button
                        onClick={async () => {
                            const newRider = await riderOnDuty(
                                rider.id,
                                rider.storeId
                            );
                        }}
                    >
                        On Duty
                    </Button>
                )}
            </TableCell>
            <TableCell>
                <Button>Edit Rider</Button>
            </TableCell>
        </TableRow>
    );
}
