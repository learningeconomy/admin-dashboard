import React from 'react';
import './logo.scss';

import useTenantMetadata from '../hooks/useTenantMetadata';

export const Logo: React.FC = () => {
    const { logo } = useTenantMetadata();

    return (
        <div className="logo">
            <img src={logo?.src} alt={logo?.alt} />
        </div>
    );
};