import { useEffect, useState } from "react";

export const usePromise = (callback) => {
    const [loaded, isLoaded] = useState(false);

    useEffect(() => {
        callback().then(() => isLoaded(true));
    }, []);

    return loaded;
};
