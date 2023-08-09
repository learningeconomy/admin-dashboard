import React from "react"
import { Props } from "../types";

import { OperationContext } from 'payload/dist/admin/components/utilities/OperationProvider'

const CreateTemplate: React.FC = ( props: Props) => {

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
        admin: {
          useAsTitle,
          disableDuplicate,
          preview,
          hideAPIURL,
        },
        versions,
        timestamps,
        auth,
        upload,
      } = collection;

    const operation = isEditing ? 'update' : 'create';

    return (
        <OperationContext.Provider value={operation}>
        <section>
            <h1>Create Template Flow</h1>


        </section>
        </OperationContext.Provider>

    );
}

export default CreateTemplate;