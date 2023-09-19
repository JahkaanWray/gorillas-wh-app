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
import { useEffect, useState } from "react";
import { getUsers } from "../../helperFunctions/userFunctions";

function emptyUserData(): UserData {
    return {
        items: [],
        recordsPerPage: 50,
        pageNumber: 1,
        totalPages: 1,
        totalRecords: 0,
    };
}

export function UserPage() {
    const [userData, setUserData] = useState<UserData>(emptyUserData());

    useEffect(() => {
        const getUserData = async () => {
            const users = await getUsers({});
            setUserData(users);
        };
        getUserData();
    }, []);
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
