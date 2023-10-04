import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useModal } from '@faceless-ui/modal';
import { Drawer } from 'payload/dist/admin/components/elements/Drawer';

import { useField } from 'payload/components/forms';

export type BatchSentProps = {
    slug: string;
};

const BatchSent: React.FC<BatchSentProps> = ({ slug }) => {
    const history = useHistory();
    const { closeModal } = useModal();

    const title = useField<string>({ path: 'title' });

    console.log({ title });

    return (
        <Drawer header={false} slug={slug} gutter={false}>
            <section className="batch-sent">
                <button
                    type="button"
                    aria-label="Close"
                    onClick={() => {
                        closeModal(slug);
                        history.push('/admin/collections/credential-batch');
                    }}
                />

                <section>
                    <header role="presentation">✔️</header>

                    <h2>{title.value} is being sent!</h2>

                    <p>
                        Your batch is now being queued for processing and emails are being sent out
                        to earners for them to claim their credentials. Please note that no further
                        changes can be made to this batch.
                    </p>

                    <Link to="/admin/collections/credential-batch" onClick={() => closeModal(slug)}>
                        Got it!
                    </Link>
                </section>
            </section>
        </Drawer>
    );
};

export default BatchSent;
