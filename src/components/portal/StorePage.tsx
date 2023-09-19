import { Store } from "@/src/lib/types";
import { Button } from "../ui/button";
import {
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Table,
} from "../ui/table";

export function StorePage(storeData: Store[]) {
    console.log(storeData);
    return (
        <>
            <Table>
                <TableHeader>
                    <TableHead>Name</TableHead>
                    <TableHead> Latitude</TableHead>
                    <TableHead>Longitude</TableHead>
                    <TableHead></TableHead>
                </TableHeader>
                <TableBody>
                    {storeData.map((store) => {
                        return (
                            <TableRow>
                                <TableCell>{store.name}</TableCell>
                                <TableCell>{store.latitude}</TableCell>
                                <TableCell>{store.longitude}</TableCell>
                                <TableCell>
                                    <Button>Edit Store</Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}
