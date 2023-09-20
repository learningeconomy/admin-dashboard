import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Props } from 'payload/components/views/Cell';

import Caret from './svgs/Caret';
import Eye from './svgs/Eye';
import Send from './svgs/Send';
import ArrowArcLeft from './svgs/ArrowArcLeft';
import BarGraph from './svgs/BarGraph';

type ActionButton =
    | { type: 'button'; label: string; icon: React.ReactNode; onClick: () => void | Promise<void> }
    | { type: 'link'; label: string; icon: React.ReactNode; url: string };

const ActionsButton: React.FC<Props> = props => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleButton = useRef<HTMLButtonElement>();

    useEffect(() => {
        function close(event: MouseEvent) {
            if (toggleButton.current && !toggleButton.current.contains(event.target as Node)) {
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
            url: `credential/${props.rowData.id}`,
        },
        { type: 'button', label: 'Resend', icon: <Send />, onClick: () => { } },
        {
            type: 'button',
            label: 'Revoke',
            icon: <ArrowArcLeft />,
            onClick: async () => {
                // TODO: Show modal, handle error/success
                const res = await fetch(`/api/revoke-credential/${props.rowData.id}`);
            },
        },
        {
            type: 'link',
            label: 'View Batch',
            icon: <BarGraph />,
            url: `credential-batch/${props.rowData.batch}`,
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
        <section className="actions-container">
            <section className={`actions ${isOpen ? 'open' : ''}`}>
                <button
                    ref={toggleButton}
                    className="header-button"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>Actions</span>
                    <Caret />
                </button>

                {actionButtons}
            </section>
        </section>
    );
};

export default ActionsButton;
