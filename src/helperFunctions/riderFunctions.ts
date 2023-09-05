export async function riderOnDuty(riderId: string, storeId: string) {
    const body = {
        storeId: storeId,
    };
    console.log(body);
    const res = await fetch(`http://localhost:8080/riders/${riderId}/onDuty`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json",
        },
    });
    const rider = await res.json();
    return rider;
}

export async function riderOffDuty(riderId: string) {
    const res = await fetch(`http://localhost:8080/riders/${riderId}/offDuty`, {
        method: "POST",
    });
    const rider = await res.json();
    return rider;
}
