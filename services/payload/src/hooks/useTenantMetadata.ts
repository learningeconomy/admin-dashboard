import { useEffect, useState, useRef, useCallback } from 'react';
import { useTheme } from 'payload/components/utilities'

export const useTenantMetadata = () => {
    const [tenant, setTenant] = useState(null);
    const { theme } = useTheme();

    const updateTenantMetadata = async () => {
        // Send request to get tenant metadata
        const res = await fetch('/api/get-tenant-metadata', { method: 'GET' });

        if (res.status === 200) {
            const { tenant } = await res.json();
            setTenant(tenant);
        }
    };

    useEffect(() => {
        if (!tenant) {
            updateTenantMetadata();
        }
    }, []);

    // Set the icon based on light/dark theme. 
    let icon = {
        src: theme === 'light' ? tenant?.lightThemeIcon?.url : tenant?.darkThemeIcon?.url,
        alt: tenant?.name 
    }

    // Set the logo based on light/dark theme. Use icon as backup if no logo exists.
    const logo = {
        src: (theme === 'light' ? tenant?.lightThemeLogo?.url : tenant?.darkThemeLogo?.url) || icon?.src,
        alt: tenant?.name 
    }

    // If the icon didn't exist, but the logo does, use the logo for the icon.
    if (!icon?.src && logo?.src) {
        icon.src = logo?.src;
    }

    const favicon = tenant?.favicon?.url || tenant?.lightThemeIcon?.url;

    return { tenant, icon, logo, favicon };
};

export default useTenantMetadata;