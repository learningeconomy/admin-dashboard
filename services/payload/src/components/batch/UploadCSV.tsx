import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { RenderFieldProps as Props } from '../types';
import { useDocumentInfo } from 'payload/components/utilities';
import BatchCredentialListPreview from '../List/BatchCredentialListPreview';
import { useField } from 'payload/components/forms';
import { Credential, CredentialTemplate } from 'payload/generated-types';
import {
    getFieldsFromHandlebarsJsonTemplate,
    getFieldsIntersectionFromHandlebarsJsonTemplate,
} from '../../helpers/handlebarhelpers';
import { AUTOMATIC_FIELDS, GENERATED_FIELDS } from '../../helpers/credential.helpers';
import CircleCheck from '../svgs/CircleCheck';
import CircleBang from '../svgs/CircleBang';
import { dedupe } from '../../helpers/array.helpers';
import { PaginatedDocs } from 'payload/dist/mongoose/types';

export type UploadCSVProps = {
    formProps: Props;
    setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
};

const UploadCSV = React.forwardRef<HTMLElement, UploadCSVProps>(function UploadCSV(
    { formProps, setIsValid },
    ref
) {
    const { id } = useDocumentInfo();
    const { value } = useField<string[]>({ path: 'csvFields' });
    const { value: templateId } = useField<string>({ path: 'template' });

    const [data, setData] = useState<PaginatedDocs<Credential>>();
    const [fields, setFields] = useState<string[]>(dedupe([...(value ?? []), ...GENERATED_FIELDS]));
    const [templateFields, setTemplateFields] = useState<string[]>([]);
    const [template, setTemplate] = useState<CredentialTemplate | undefined>();

    const fieldsIntersection = getFieldsIntersectionFromHandlebarsJsonTemplate(
        fields,
        templateFields
    );

    const fetchBatchCredentials = async (page = 1) => {
        const res = await fetch('/api/get-batch-credentials', {
            method: 'POST',
            body: JSON.stringify({ batchId: id, page }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        if (res.status === 200) {
            const { data } = await res.json();

            setData(data);
            console.log('///get batch credentials', data);
        }
    };

    useEffect(() => {
        if (templateId) {
            fetch(`/api/credential-template/${templateId}`)
                .then(res => res.json())
                .then(setTemplate);
        }
    }, [templateId]);

    useEffect(() => {
        if (template) {
            setTemplateFields(
                dedupe([
                    ...getFieldsFromHandlebarsJsonTemplate(JSON.stringify(template)),
                    ...AUTOMATIC_FIELDS,
                ])
            );
        }
    }, [template]);

    useEffect(
        () => setIsValid(data && fieldsIntersection.missingInCSV.length === 0),
        [data, fieldsIntersection.missingInCSV.length]
    );

    // replace this with react-query package...todo
    useEffect(() => {
        fetchBatchCredentials();
    }, []);

    const handleOnChange = e => {
        Papa.parse(e.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: async results => {
                console.log('///parsed results', results);

                console.log(results.data);
                // if no errors and there is data
                if (results?.data?.length > 0 && results?.errors?.length === 0) {
                    // Send parsed csv object to endpoint to create credential records
                    const res = await fetch('/api/create-batch-credentials', {
                        // Adding method type
                        method: 'POST',

                        // Adding body or contents to send
                        body: JSON.stringify({
                            batchId: id,
                            credentialRecords: results?.data,
                            fields: results?.meta?.fields ?? [],
                        }),
                        // Adding headers to the request
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        },
                    });
                    console.log('///res', res);

                    if (res.status === 200) {
                        const { data, newBatch } = await res.json();
                        setFields(dedupe([...(newBatch?.csvFields ?? []), ...GENERATED_FIELDS]));
                        await fetchBatchCredentials();
                        console.log('///create batch creds endpoint test', data);
                    }
                }
            },
        });
    };

    return (
        <section
            ref={ref}
            className="w-full h-full flex-shrink-0 p-10 overflow-y-auto upload-csv-wrapper"
        >
            <h2 className="mt-5 text-[--theme-text] text-3xl font-semibold mb-5 font-inter">
                Upload & Manage Earner Information
            </h2>
            {!formProps.readOnly && (
                <>
                    <p className="text-[--theme-text] text-xl font-medium font-inter mb-15">
                        Upload a CSV file to import credential and earner information.
                    </p>

                    <p className="flex gap-2 items-center flex-wrap rounded bg-blue-200 text-black font-roboto px-6 py-2 my-3">
                        <CircleBang className="w-5 h-5" />
                        <span>
                            You <b>MUST</b> include a valid email address under the column{' '}
                            <code className="rounded bg-gray-100 p-1">emailAddress</code>, a valid
                            name under the column{' '}
                            <code className="rounded bg-gray-100 p-1">earnerName</code>, and a valid
                            credential name under the column{' '}
                            <code className="rounded bg-gray-100 p-1">credentialName</code> for
                            every entry in the CSV
                        </span>
                    </p>

                    <form>
                        <input
                            type={'file'}
                            id={'csvFileInput'}
                            accept={'.csv'}
                            onChange={handleOnChange}
                            className="upload-csv-input"
                        />
                    </form>
                </>
            )}

            {data &&
                (fieldsIntersection.missingInCSV.length > 0 ? (
                    <output className="flex gap-2 items-center flex-wrap rounded bg-red-400 text-black font-roboto px-6 py-2 my-3">
                        <CircleBang className="w-5 h-5" />
                        <span>CSV is missing the following fields:</span>
                        <span className="font-bold">
                            {fieldsIntersection.missingInCSV.join(', ')}.
                        </span>
                    </output>
                ) : (
                    <output className="flex gap-2 items-center bg-green-200 text-black font-roboto px-6 py-2 my-3">
                        <CircleCheck className="w-5 h-5" />
                        <span>CSV contains all fields.</span>
                    </output>
                ))}

            {data &&
                (fieldsIntersection.missingInTemplate.length > 0 ? (
                    <output className="flex gap-2 items-center flex-wrap rounded bg-orange-400 text-black font-roboto px-6 py-2 my-3">
                        <CircleBang className="w-5 h-5" />
                        <span>Template is missing the following fields that were in the CSV:</span>
                        <span className="font-bold">
                            {fieldsIntersection.missingInTemplate.join(', ')}.
                        </span>
                    </output>
                ) : (
                    <output className="flex gap-2 items-center rounded bg-green-200 text-black font-roboto px-6 py-2 my-3">
                        <CircleCheck className="w-5 h-5" />
                        <span>Template is using all fields that were in the CSV.</span>
                    </output>
                ))}

            <section>
                {id && data && (
                    <BatchCredentialListPreview
                        data={data}
                        refetch={fetchBatchCredentials}
                        readOnly={formProps.readOnly}
                    />
                )}
            </section>
        </section>
    );
});

export default UploadCSV;
