export type OrderStatus =
    | "NEW"
    | "PROCESSING"
    | "READY"
    | "ASSIGNED"
    | "DELIVERING"
    | "COMPLETE"
    | "CANCELLED";

export type OrderDetail = {
    id: string;
    quantity: number;
    productId: string;
};

export type Order = {
    id: string;
    storeId: string;
    store: {
        id: string;
        name: string;
    };
    riderId: string;
    pickerId: string;
    customerId: string;
    rider: {
        id: string;
        name: string;
    };
    picker: {
        id: string;
        name: string;
    };
    customer: {
        id: string;
        name: string;
    };
    createdOn: string;
    pickedOn: string;
    confirmedOn: string;
    assignedOn: string;
    startedOn: string;
    completedOn: string;

    addressId: string;
    address: {
        id: string;
        line1: string;
    };
    status: OrderStatus;
    orderDetails: OrderDetail[];
};

export type User = {
    id: string;
    name: string;
    role: Role;
    team: Store;
    stores: Store[];
    createdOn: string;
};

export type ListReturnSchema<T> = {
    items: T[];
    recordsPerPage: number;
    pageNumber: number;
    totalPages: number;
    totalRecords: number;
};

export type OrderData = ListReturnSchema<Order>;
export type RiderData = ListReturnSchema<Rider>;

export type Role =
    | "PICKER"
    | "SUPERVISOR"
    | "MANAGER"
    | "AREA_MANAGER"
    | "ADMIN";

export type Rider = {
    id: string;
    name: string;
    storeId: string;
    store: {
        id: string;
        name: string;
    };
    status: RiderStatus;
};

export type RiderStatus = "ON_DUTY" | "OFF_DUTY" | "INACTIVE";

export type Store = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
};

export type InventoryEntry = {
    id: string;
    quantity: number;
    published: boolean;
    productId: string;
    product: {
        id: string;
        name: string;
    };
    store: {
        id: string;
        name: string;
    };
};

export type OrderFilters = {
    store: Record<string, Store & boolean>;
    status: Record<OrderStatus, boolean>;
    rider: Record<string, Rider & boolean>;
    createdBefore?: string;
    createdAfter?: string;
};

export type OrderSorting = {
    orderBy: "asc" | "desc";
};

export type InventoryData = ListReturnSchema<InventoryEntry>;
export type UserData = ListReturnSchema<User>;
