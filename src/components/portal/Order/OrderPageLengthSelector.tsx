import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../../ui/select";

export function OrderPageLengthSelector() {
    return (
        <Select>
            <SelectTrigger>
                <SelectValue></SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="75">75</SelectItem>
                <SelectItem value="100">100</SelectItem>
            </SelectContent>
        </Select>
    );
}
