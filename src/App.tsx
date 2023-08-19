import { useState } from "react";
import CustomerStore from "./CustomerStore";
import Portal from "./Portal";
import WHApp from "./WHApp";
import RiderApp from "./RiderApp";

function App() {
    const [mode, setMode] = useState(0);
    return (
        <>
            <button
                onClick={() => {
                    setMode((mode + 1) % 4);
                }}
            >
                Switch Mode
            </button>

            {mode == 0 ? (
                <>
                    <h1>Customer Store</h1>
                    <CustomerStore />
                </>
            ) : mode == 1 ? (
                <>
                    <h1>Warehouse App</h1>
                    <WHApp />
                </>
            ) : mode == 2 ? (
                <>
                    <h1>Portal</h1>
                    <Portal />
                </>
            ) : mode == 3 ? (
                <>
                    <h1>Rider App</h1>
                    <RiderApp />
                </>
            ) : null}
        </>
    );
}

export default App;
