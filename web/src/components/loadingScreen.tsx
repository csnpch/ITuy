import { useState, useEffect } from "react";

export default function LoadingScreen() {
    const [statusLoading, setStatusLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => {
        setStatusLoading(false);
        }, 400);
    }, []);

    return (
        <>
            {
                statusLoading 
                ? <div className={`container-loading-screen bg-white`}></div>
                : <div className="absolute"></div>
            }
        </>
    );
}
