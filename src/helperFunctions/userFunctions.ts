export async function getUsers() {
    const res = await fetch(`http://localhost:8080/users`);
    const data = await res.json();
    return data;
}
