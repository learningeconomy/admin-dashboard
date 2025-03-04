import React from 'react';
import './logo.scss';

import useTenantMetadata from '../hooks/useTenantMetadata';

export const Icon: React.FC = () => {
    const { icon } = useTenantMetadata();

    return (
        <div className="icon">
            <img src={icon?.src} alt={icon?.alt} />
        </div>
    );
};