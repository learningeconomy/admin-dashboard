import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { useDocumentInfo } from 'payload/components/utilities';
import BatchCredentialListPreview from '../List/BatchCredentialListPreview';
import { useField } from 'payload/components/forms';
import { CredentialTemplate } from 'payload/generated-types';
import {
    getFieldsFromHandlebarsJsonTemplate,
    getFieldsIntersectionFromHandlebarsJsonTemplate,
} from '../../helpers/handlebarhelpers';
import { AUTOMATIC_FIELDS } from '../../helpers/credential.helpers';

const UploadCSV = React.forwardRef<HTMLElement>(function UploadCSV(_props, ref) {
    const { id } = useDocumentInfo();
    const { value } = useField({ path: 'csvFields' });
    const { value: templateId } = useField({ path: 'template' });

    const [data, setData] = useState();
    const [fields, setFields] = useState<string[]>([...(value ?? []), ...AUTOMATIC_FIELDS]);
    const [templateFields, setTemplateFields] = useState([]);
    const [template, setTemplate] = useState<CredentialTemplate | undefined>();

    const fieldsIntersection = getFieldsIntersectionFromHandlebarsJsonTemplate(
        fields,
        templateFields
    );

    const fetchBatchCredentials = async () => {
        const res = await fetch('/api/get-batch-credentials', {
            method: 'POST',
            body: JSON.stringify({ batchId: id }),
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
            setTemplateFields([
                ...getFieldsFromHandlebarsJsonTemplate(JSON.stringify(template)),
                ...AUTOMATIC_FIELDS,
            ]);
        }
    }, [template]);

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
                        setFields([...(newBatch?.csvFields ?? []), ...AUTOMATIC_FIELDS]);
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
            <p className="text-[--theme-text] text-xl font-medium font-inter mb-15">
                Upload a CSV file to import credential and earner information.
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

            {fieldsIntersection.missingInCSV.length > 0 ? (
                <output className="block rounded bg-red-500 text-white px-6 py-2 my-3">
                    CSV is missing the following fields:{' '}
                    {fieldsIntersection.missingInCSV.join(', ')}.
                </output>
            ) : (
                <></>
            )}

            {fieldsIntersection.missingInTemplate.length > 0 ? (
                <output className="block rounded bg-orange-500 text-white px-6 py-2 my-3">
                    Template is missing the following fields that were in the CSV:{' '}
                    {fieldsIntersection.missingInTemplate.join(', ')}.
                </output>
            ) : (
                <></>
            )}

            <section>
                {id && data && (
                    <BatchCredentialListPreview data={data} refetch={fetchBatchCredentials} />
                )}
            </section>
        </section>
    );
});

export default UploadCSV;
