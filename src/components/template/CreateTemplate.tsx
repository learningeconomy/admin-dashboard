import React, { useCallback } from "react";
import { Props } from "../types";
import { useAuth } from "payload/components/utilities";
import { OperationContext } from "payload/dist/admin/components/utilities/OperationProvider";
import CustomRenderFields from "../CustomRenderFields";
import fieldTypes from "payload/dist/admin/components/forms/field-types";
import Form from "payload/dist/admin/components/forms/Form";

const baseClass = "collection-edit";
import RenderFields from "payload/dist/admin/components/forms/RenderFields";

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

  const operation = isEditing ? "update" : "create";

  const onSave = useCallback(
    async (json) => {
      if (auth && id === user.id) {
        await refreshCookieAsync();
      }

      if (typeof onSaveFromProps === "function") {
        onSaveFromProps({
          ...json,
          operation: id ? "update" : "create",
        });
      }
    },
    [id, onSaveFromProps, auth, user, refreshCookieAsync]
  );

  return (
    <OperationContext.Provider value={operation}>
      <Form
        className={`${baseClass}__form`}
        method={id ? "patch" : "post"}
        action={action}
        onSuccess={onSave}
        disabled={!hasSavePermission}
        initialState={internalState}
      >
        <section className="flow-container">
          <h1>Create Template Flow</h1>
          {!isLoading && (
            <CustomRenderFields
              readOnly={!hasSavePermission}
              permissions={permissions.fields}
              filter={(field) =>
                !field?.admin?.position || field?.admin?.position !== "sidebar"
              }
              fieldTypes={fieldTypes}
              fieldSchema={fields}
            />
          )}
        </section>
      </Form>
    </OperationContext.Provider>
  );
};

export default CreateTemplate;
