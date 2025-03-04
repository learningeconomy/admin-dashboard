import React from 'react';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import { Link } from 'react-router-dom';
import './TrustRegistryPageDescription.scss';

const TrustRegistryPageDescription: React.FC = () => {
    const {
        routes: { admin: adminRoute },
    } = useConfig();

    return (
        <div className="header_wrapper">
            <p className="header_paragraph"></p>
            <Link className="header_template_button" to={`${adminRoute}/collections/trust-registry/create`}>
                <img className="plus_icon" src="/assets/plus-icon.svg" alt="plus icon" />
                Create New Entry
            </Link>
        </div>
    );
};

export default TrustRegistryPageDescription;
