import React from 'react';
import './logo.scss';
import { Helmet } from "react-helmet";

import useTenantMetadata from '../hooks/useTenantMetadata';

export const Logo: React.FC = () => {
    const { logo, favicon } = useTenantMetadata();

    return (
        <div className="logo">
            <img src={logo?.src} alt={logo?.alt} />
            <Helmet>
                <meta charSet="utf-8" />
                <title>LearnCloud {logo?.alt ? ` - ${logo?.alt}` : ''}</title>
                <link rel="icon" type="image/png" href={favicon} sizes="16x16" />
            </Helmet>
        </div>
    );
};