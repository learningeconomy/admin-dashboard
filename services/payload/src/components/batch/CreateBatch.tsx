import React, { useCallback, useState, useEffect } from 'react';
import { Props } from '../types';
import { useAuth } from 'payload/components/utilities';
import { OperationContext } from 'payload/dist/admin/components/utilities/OperationProvider';
import RenderBatchFlowFields from './RenderBatchFlowFields';
import fieldTypes from 'payload/dist/admin/components/forms/field-types';
import Form from '../Form/Form';
import './batch.scss';
import '../global.scss';
const baseClass = 'collection-edit';
import SidebarMenu from '../Form/SidebarMenu';
import { insertValuesIntoHandlebarsJsonTemplate } from '../../helpers/handlebarhelpers';

const CreateBatch: React.FC = (props: Props) => {
    const { user, refreshCookieAsync } = useAuth();

    const {
        collection,
        isEditing,
        data,
        onSave: onSaveFromProps,
        permissions,
        isLoading,
        internalState,
        apiURL,
        action,
        hasSavePermission,
        disableEyebrow,
        disableActions,
        disableLeaveWithoutSaving,
        customHeader,
        id,
        updatedAt,
    } = props;

    console.log('///internalState', internalState);

    const {
        slug,
        fields,
        admin: { useAsTitle, disableDuplicate, preview, hideAPIURL },
        versions,
        timestamps,
        auth,
        upload,
    } = collection;

    const operation = isEditing ? 'update' : 'create';

    const onSave = useCallback(
        
        async json => {
            if (auth && id === user.id) {
                await refreshCookieAsync();
            }
            console.log('///onSAVE', internalState);
            if (typeof onSaveFromProps === 'function') {
                onSaveFromProps({
                    ...json,
                    operation: id ? 'update' : 'create',
                });
            }
        },
        [id, onSaveFromProps, auth, user, refreshCookieAsync]
    );

    const sendOutBatchEmails = async (formData) => {
        console.log('//formData', formData);
        const res = await fetch('/api/send-batch-email', {
            method: 'POST',
            body: JSON.stringify({ batchId: id, emailTemplateId: formData?.emailTemplate }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        if (res.status === 200) {
            const { data } = await res.json();
            console.log('///sent batch for processing', data);
        }
    };

    // Submit batch id to endpoint for sending out emails
    const handleOnSubmit = async (fields, formData) => {
        
        console.log('///handleonSave', 'fields', fields, 'formData', formData);
        // trigger send email
        const data = await sendOutBatchEmails(formData);
        // if success show success modal....
    };

    useEffect(() => {
        const jsonTemplateValue = insertValuesIntoHandlebarsJsonTemplate();
        console.log('//jsonTemplateValue', jsonTemplateValue);
    }, []);

    return (
        <OperationContext.Provider value={operation}>
            <Form
                className={`${baseClass}__form`}
                method={id ? 'patch' : 'post'}
                action={action}
                onSubmit={handleOnSubmit}
                onSuccess={onSave}
                disabled={!hasSavePermission}
                initialState={internalState}
            >
                <section className="flow-container">
                    <h1>Create Batch Flow</h1>
                    {!isLoading && (
                        <>
                            <RenderBatchFlowFields
                                readOnly={!hasSavePermission}
                                permissions={permissions.fields}
                                filter={field =>
                                    !field?.admin?.position || field?.admin?.position !== 'sidebar'
                                }
                                fieldTypes={fieldTypes}
                                fieldSchema={fields}
                            />
                            <SidebarMenu {...props} />
                        </>
                    )}
                </section>
            </Form>
        </OperationContext.Provider>
    );
};

export default CreateBatch;

