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

export async function getRiders(requestBody: any) {
    const res = await fetch(`http://localhost:8080/riders/list`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "content-type": "application/json",
        },
    });
    const riders = await res.json();
    return riders;
}

export async function editRider(riderId: string, requestBody: any) {
    const res = await fetch(`http://localhost:8080/riders/${riderId}`, {
        method: "PUT",
        body: requestBody,
        headers: {
            "content-type": "application/json",
        },
    });
    const rider = await res.json();
    return rider;
}
