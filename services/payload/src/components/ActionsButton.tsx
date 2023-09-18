import React, { useState } from 'react';
import { Props } from 'payload/components/views/Cell';

import Caret from './svgs/Caret';
import Eye from './svgs/Eye';
import Send from './svgs/Send';
import ArrowArcLeft from './svgs/ArrowArcLeft';
import BarGraph from './svgs/BarGraph';

const ActionsButton: React.FC<Props> = props => {
    const [isOpen, setIsOpen] = useState(false);

    const items: { onClick: () => void | Promise<void>; label: string; icon: React.ReactNode }[] = [
        { label: 'View Details', icon: <Eye />, onClick: () => { } },
        { label: 'Resend', icon: <Send />, onClick: () => { } },
        {
            label: 'Revoke',
            icon: <ArrowArcLeft />,
            onClick: async () => {
                // TODO: Show modal, handle error/success
                const res = await fetch(`/api/revoke-credential/${props.rowData.id}`);
            },
        },
        { label: 'View Batch Metrics', icon: <BarGraph />, onClick: () => { } },
    ];

    return (
        <section className="actions-container">
            <section className={`actions ${isOpen ? 'open' : ''}`}>
                <button className="header-button" type="button" onClick={() => setIsOpen(!isOpen)}>
                    <span>Actions</span>
                    <Caret />
                </button>

                {items.map(item => (
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
                ))}
            </section>
        </section>
    );
};

export default ActionsButton;
