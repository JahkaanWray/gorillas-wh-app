export async function completeOrder(orderId: string) {
    const res = await fetch(
        `http://localhost:8080/orders/${orderId}/complete`,
        {
            method: "POST",
        }
    );
    const order = await res.json();
    return order;
}

export async function assignOrder(orderId: string, riderId: string) {
    const body = { riderId: riderId };
    const res = await fetch(`http://localhost:8080/orders/${orderId}/assign`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json",
        },
    });
    const order = await res.json();
    return order;
}

export async function cancelOrder(orderId: string) {
    const res = await fetch(`http://localhost:8080/orders/${orderId}/cancel`, {
        method: "POST",
    });
    const order = await res.json();
    return order;
}

export async function startOrder(orderId: string) {
    const res = await fetch(`http://localhost:8080/orders/${orderId}/start`, {
        method: "POST",
    });
    const order = await res.json();
    return order;
}

export async function unassignOrder(orderId: string) {
    const res = await fetch(
        `http://localhost:8080/orders/${orderId}/unassign`,
        {
            method: "POST",
        }
    );
    const order = await res.json();
    return order;
}

export async function unpickOrder(orderId: string) {
    const res = await fetch(`http://localhost:8080/orders/${orderId}/unpick`, {
        method: "POST",
    });
    const data = await res.json();
    return data;
}

export async function getOrders(params: any) {
    const res = await fetch(`http://localhost:8080/orders/list`, {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
            "content-type": "application/json",
        },
    });
    const data = await res.json();
    return data;
}

export async function confirmOrder(orderId: string) {
    const res = await fetch(`http://localhost:8080/orders/${orderId}/confirm`, {
        method: "POST",
    });
    const data = await res.json();
    return data;
}

export async function pickOrder(orderId: string, pickerId: string) {
    const body = {
        pickerId: pickerId,
    };
    const res = await fetch(`http://localhost:8080/orders/${orderId}/pick`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json",
        },
    });
    const data = await res.json();
    return data;
}
