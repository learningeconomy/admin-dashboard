import { useEffect, useState, useRef, useCallback } from 'react';
import { useTheme } from 'payload/components/utilities';

export const useTrustRegistry = () => {
    const [registry, setRegistry] = useState(null);
    const { theme } = useTheme();

    const updateRegistry = async () => {
        // Send request to get tenant metadata
        const res = await fetch('/api/registry', { method: 'GET' });

        if (res.status === 200) {
            const data = await res.json();
            setRegistry(data);
        }
    };

    useEffect(() => {
        updateRegistry();
    }, []);

    return { registry };
};

export default useTrustRegistry;