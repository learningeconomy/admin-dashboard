import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '@faceless-ui/modal';
import { Props } from 'payload/components/views/Cell';

import Caret from './svgs/Caret';
import Eye from './svgs/Eye';
import Send from './svgs/Send';
import ArrowArcLeft from './svgs/ArrowArcLeft';
import BarGraph from './svgs/BarGraph';
import RevocationWarning from './credential/RevocationWarning';
import { Credential } from 'payload/generated-types';
import { CREDENTIAL_STATUS } from '../constants/credentials';
import RevocationDetails from './credential/RevocationDetails';

type ActionButton =
    | { type: 'button'; label: string; icon: React.ReactNode; onClick: () => void | Promise<void> }
    | { type: 'link'; label: string; icon: React.ReactNode; url: string };

const ActionsButton: React.FC<Props> = ({ rowData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const container = useRef<HTMLElement>();
    const { openModal } = useModal();

    const isRevoked = rowData.status === CREDENTIAL_STATUS.REVOKED;
    const revocationSlug = `revocation-${isRevoked ? 'details' : 'warning'}-${rowData.id}`;

    useEffect(() => {
        function close(event: MouseEvent) {
            if (container.current && !container.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) document.addEventListener('mousedown', close);
        else document.removeEventListener('mousedown', close);

        return () => document.removeEventListener('mousedown', close);
    }, [isOpen]);

    const items: ActionButton[] = [
        {
            type: 'link',
            label: 'View Details',
            icon: <Eye />,
            url: `credential/${rowData.id}`,
        },
        {
            type: 'button',
            label: 'Resend',
            icon: <Send />,
            onClick: async () => {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ credentialId: rowData.id }),
                });

                console.log(await response.json());
            },
        },
        {
            type: 'button',
            label: isRevoked ? 'View Revocation Details' : 'Revoke',
            icon: <ArrowArcLeft />,
            onClick: () => openModal(revocationSlug),
        },
        {
            type: 'link',
            label: 'View Batch',
            icon: <BarGraph />,
            url: `credential-batch/${rowData.batch}`,
        },
    ];

    const actionButtons = items.map(item => {
        if (item.type === 'button') {
            return (
                <button
                    key={item.label}
                    onClick={() => {
                        setIsOpen(false);
                        item.onClick();
                    }}
                    type="button"
                    className="action-button"
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            );
        }

        return (
            <Link to={item.url} key={item.label} className="action-button">
                {item.icon}
                <span>{item.label}</span>
            </Link>
        );
    });

    return (
        <section ref={container} className="actions-container">
            <section className={`actions ${isOpen ? 'open' : ''}`}>
                <button className="header-button" type="button" onClick={() => setIsOpen(!isOpen)}>
                    <span>Actions</span>
                    <Caret />
                </button>

                {actionButtons}
            </section>

            {isRevoked ? (
                <RevocationDetails
                    credential={rowData as any as Credential}
                    slug={revocationSlug}
                />
            ) : (
                <RevocationWarning
                    credential={rowData as any as Credential}
                    slug={revocationSlug}
                />
            )}
        </section>
    );
};

export default ActionsButton;
