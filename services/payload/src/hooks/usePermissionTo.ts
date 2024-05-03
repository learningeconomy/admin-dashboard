import { useEffect, useState } from 'react';
import { CustomOperation } from '../constants/roles/customOperations';

export const usePermissionTo = (operation: CustomOperation, credentialId: string | undefined) => {
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(null);

    const updatePermissionData = async () => {
        // Send request to get tenant metadata
        const res = await fetch(`/api/permission-to/${operation}/${credentialId}`, { method: 'GET' });

        if (res.status === 200) {
            const { permission } = await res.json();
            setAllowed(permission);
            setLoading(false)
        }
    };

    useEffect(() => {
        if (!credentialId) {
            setLoading(true);
            updatePermissionData();
        }
    }, [credentialId]);

    return { allowed, loading };
};

export default usePermissionTo;