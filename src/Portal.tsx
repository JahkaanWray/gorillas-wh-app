import { useEffect, useState } from "react";

function Portal() {
    const [orderData, setOrderData] = useState<object[] | null>(null);
    const [storeId, setStoreId] = useState(null);
    const [storeOptions, setStoreOptions] = useState<any>(null);

    useEffect(() => {
        const getData = async () => {
            const res = await fetch("http://localhost:8080/stores");
            const data = await res.json();
            setStoreOptions(data);
        };
        getData();
    }, []);

    useEffect(() => {
        if (storeId) {
            const getData = async () => {
                const res = await fetch(
                    "http://localhost:8080/orders?" +
                        new URLSearchParams({ storeId: storeId })
                );
                const orders = await res.json();
                setOrderData(orders);
            };
            getData();
        }
    }, [storeId]);

    return storeOptions == null ? (
        <>Loading...</>
    ) : storeId == null ? (
        <>
            {storeOptions.map((store: any) => {
                return (
                    <div
                        onClick={() => {
                            setStoreId(store.id);
                        }}
                    >
                        {store.name}
                    </div>
                );
            })}
        </>
    ) : orderData ? (
        <>
            <button
                onClick={() => {
                    setStoreId(null);
                }}
            >
                Back
            </button>
            <table>
                <tr>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th></th>
                </tr>
                {orderData.map((order: any) => {
                    return (
                        <tr>
                            <td>{order.customer.name}</td>
                            <td>{order.address.line1}</td>
                            <td>{order.status}</td>
                            <td>
                                <button>Test</button>
                            </td>
                        </tr>
                    );
                })}
            </table>
        </>
    ) : (
        <>Loading...</>
    );
}

export default Portal;
