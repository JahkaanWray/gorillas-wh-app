import { UserData } from "@/src/lib/types";
import { Button } from "../ui/button";
import {
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Table,
} from "../ui/table";

export function UserPage(userData: UserData) {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableHead>Name</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                </TableHeader>
                <TableBody>
                    {userData.items.map((user) => {
                        return (
                            <TableRow>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.stores[0].name}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button>Edit User</Button>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}
