import React from 'react';
import { Props } from 'payload/components/views/Cell';

const CredentialStatusCell: React.FC<Props> = ({ rowData }) => {
    return (
        <section className="credential-status">
            <span className={(rowData.status as string).toLowerCase()}>
                {rowData.status as string}
            </span>
        </section>
    );
};

export default CredentialStatusCell;
