export async function getInventoryEntries(requestBody: any) {
    const res = await fetch(`http://localhost:8080/inventory/list`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "content-type": "application/json",
        },
    });
    const inventory = await res.json();
    return inventory;
}
