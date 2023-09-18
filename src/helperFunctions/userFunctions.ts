export async function getUsers(requestBody: any) {
    const res = await fetch(`http://localhost:8080/users/list`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "content-type": "application/json",
        },
    });
    const data = await res.json();
    return data;
}
