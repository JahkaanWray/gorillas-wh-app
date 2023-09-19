import { Store } from "../lib/types";

export async function findNearestStore(location: {
    latitude: number;
    longitude: number;
}): Promise<Store> {
    const res = await fetch(`http://localhost:8080/findStore`, {
        method: "POST",
        body: JSON.stringify(location),
        headers: {
            "content-type": "application/json",
        },
    });
    const store = await res.json();
    return store;
}

export async function getStores(requestBody: any): Promise<Store[]> {
    const res = await fetch(`http://localhost:8080/stores`);
    const stores = await res.json();
    return stores;
}
