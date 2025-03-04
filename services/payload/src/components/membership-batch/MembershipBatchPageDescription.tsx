import React, { useState, useEffect } from 'react';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import { Link } from 'react-router-dom';
import { totalSentBatchesQuery } from '../../constants/countQueries';
import { useAuth } from 'payload/dist/admin/components/utilities/Auth';

const MembershipBatchPageDescription: React.FC = () => {
    const {
        routes: { admin: adminRoute },
    } = useConfig();

    const { user, permissions } = useAuth();
    const [count, setCount] = useState<number | undefined>(0);

    const fetchBatchCredentials = async (page = 1) => {
        const res = await fetch('/api/get-collection-count', {
            method: 'POST',
            body: JSON.stringify({
                collectionName: 'membership-batch',
                query: totalSentBatchesQuery,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (res.status === 200) {
            const data = await res.json();

            setCount(data?.count);
        }
    };

    useEffect(() => {
        fetchBatchCredentials();
    }, []);

    const permissionOnCollection = (
        collection: string,
        permission: 'read' | 'create' | 'update' | 'delete' = 'read'
    ): boolean | undefined => permissions?.collections?.[collection]?.[permission]?.permission;

    return (
        <div>
            <div className="header_wrapper">
                <p className="header_paragraph">
                    <span className="header_number">{count}</span> Issued Batches
                </p>
                {permissionOnCollection('credential-batch', 'create') && (
                    <Link
                        className="header_button"
                        to={`${adminRoute}/collections/membership-batch/create`}
                    >
                        <img
                            className="header_plus_icon"
                            src="/assets/plus-icon.svg"
                            alt="plus icon"
                        />
                        Upload and Prepare Batch
                    </Link>
                )}
            </div>
        </div>
    );
};

export default MembershipBatchPageDescription;