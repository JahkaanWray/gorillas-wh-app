import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../../ui/select";

export function OrderSortAndFilterSelector() {
    return (
        <>
            <Select>
                <SelectTrigger>
                    <SelectValue>Sort By</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="createdOn">Created On</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger>
                    <SelectValue>Order By</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="asc">ASC</SelectItem>
                    <SelectItem value="desc">DESC</SelectItem>
                </SelectContent>
            </Select>
        </>
    );
}
