import React, { useCallback, useState, useEffect } from 'react';
import { Props } from '../types';
import { useAuth } from 'payload/components/utilities';
import { OperationContext } from 'payload/dist/admin/components/utilities/OperationProvider';
import RenderBatchFlowFields from './RenderBatchFlowFields';
import fieldTypes from 'payload/dist/admin/components/forms/field-types';
import Form from '../Form/Form';
import './batch.scss';
import '../global.scss';
import { RenderFieldProps } from '../types';
const baseClass = 'collection-edit';
import RenderFields from 'payload/dist/admin/components/forms/RenderFields';
import { useAllFormFields, reduceFieldsToValues, getSiblingData } from 'payload/components/forms';
import SidebarMenu from '../Form/SidebarMenu';
import { insertValuesIntoHandlebarsJsonTemplate } from '../../helpers/handlebarhelpers';


const MAP_FIELDS_TO_STEPS = {
    1: ['title', 'description', 'internalNotes'],
    2: ['template'],
    3: ['emailTemplate'],
};

const getFieldsForStep = (step: number = 1, fieldSchema) => {
    const fieldsForStep = MAP_FIELDS_TO_STEPS[step];
    const stepFields = fieldSchema.filter(field => fieldsForStep.includes(field.name));
    return stepFields;
};

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

            if (typeof onSaveFromProps === 'function') {
                onSaveFromProps({
                    ...json,
                    operation: id ? 'update' : 'create',
                });
            }
        },
        [id, onSaveFromProps, auth, user, refreshCookieAsync]
    );

    console.log('///batchid', id);

    const sendOutBatchEmails= async () => {
        const res = await fetch("/api/send-batch-email", {
          method: "POST",
          body: JSON.stringify({batchId: id}),
          headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
        });
        if (res.status === 200) {
          const { data } = await res.json();
          console.log("///sent batch for processing", data);
        }
    };
    

    // Submit batch id to endpoint for sending out emails
    const handleOnSubmit = async() => {
        console.log('///handle on save');
        // trigger send email
        const data = await sendOutBatchEmails();
      
    }

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
