import React, { useCallback, useState, useEffect } from "react";
import { Props } from "../types";
import { useAuth } from "payload/components/utilities";
import { OperationContext } from "payload/dist/admin/components/utilities/OperationProvider";
import RenderBatchFlowFields from "./RenderBatchFlowFields";
import fieldTypes from "payload/dist/admin/components/forms/field-types";
import Form from "payload/dist/admin/components/forms/Form";
import './batch.scss';
import '../global.scss';
import { RenderFieldProps } from '../types';
const baseClass = "collection-edit";
import RenderFields from "payload/dist/admin/components/forms/RenderFields";



const MAP_FIELDS_TO_STEPS = {
    1: ['title', 'description', 'internalNotes'],
    2: ['template'],
    3: ['emailTemplate'],
}


const getFieldsForStep = (step: number = 1, fieldSchema) => {
    const fieldsForStep = MAP_FIELDS_TO_STEPS[step];
    const stepFields = fieldSchema.filter( field => fieldsForStep.includes(field.name));
    return stepFields;
}

const CreateBatch: React.FC = (props: Props) => {
  const { user, refreshCookieAsync } = useAuth();


  const [ step, setStep ] = useState<number>(1);
  const [formFields, setFormFields ] = useState()


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

  useEffect(()=> {
    if(fields){
        const formFields = getFieldsForStep(step, fields)
        setFormFields(formFields);
    }

  },[fields, step])

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

  const handleNextStep=()=> {
    setStep(step + 1)
  }

  console.log('///internalState', internalState);

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
          <h1>Create Batch Flow</h1>
          {!isLoading && (
            <RenderBatchFlowFields
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

export default CreateBatch;


