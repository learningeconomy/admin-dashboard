import React, { useCallback } from 'react';
import { Props } from '../types';
import { useAuth } from 'payload/components/utilities';
import { OperationContext } from 'payload/dist/admin/components/utilities/OperationProvider';
import CustomRenderFields from '../CustomRenderFields';
import fieldTypes from 'payload/dist/admin/components/forms/field-types';
import Form from 'payload/dist/admin/components/forms/Form';
import { useForm } from 'payload/components/forms';
const baseClass = 'collection-edit';
import RenderFields from 'payload/dist/admin/components/forms/RenderFields';
import SidebarMenu from '../Form/SidebarMenu';

const TemplateForm: React.FC = (props: Props) => {
    const { submit, validateForm } = useForm();

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

    return (
        <>
            <CustomRenderFields
                readOnly={!hasSavePermission}
                permissions={permissions.fields}
                filter={field => !field?.admin?.position || field?.admin?.position !== 'sidebar'}
                fieldTypes={fieldTypes}
                fieldSchema={fields}
            />
            <div></div>
        </>
    );
};

const CreateTemplate: React.FC = (props: Props) => {
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

    const { submit, validateForm } = useForm();

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

    return (
        <OperationContext.Provider value={operation}>
            <Form
                className={`${baseClass}__form`}
                method={id ? 'patch' : 'post'}
                action={action}
                onSuccess={onSave}
                disabled={!hasSavePermission}
                initialState={internalState}
            >
                <section className="flow-container">
                    <h1>Create Template</h1>
                    {!isLoading && (
                        <>
                            <TemplateForm {...props} />
                            <SidebarMenu {...props} />
                        </>
                    )}
                </section>
            </Form>
        </OperationContext.Provider>
    );
};

export default CreateTemplate;
