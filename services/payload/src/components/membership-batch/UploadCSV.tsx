import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { RenderFieldProps as Props } from '../types';
import { useDocumentInfo } from 'payload/components/utilities';
import BatchMembershipListPreview from './BatchMembershipListPreview';
import { useField } from 'payload/components/forms';
import { Membership, MembershipTemplate } from 'payload/generated-types';
import {
    getFieldsFromHandlebarsJsonTemplate,
    getFieldsIntersectionFromHandlebarsJsonTemplate,
} from '../../helpers/handlebarhelpers';
import { GUARANTEED_FIELDS, GENERATED_FIELDS } from '../../helpers/credential.helpers';
import CircleCheck from '../svgs/CircleCheck';
import CircleBang from '../svgs/CircleBang';
import { dedupe } from '../../helpers/array.helpers';
import { PaginatedDocs } from 'payload/dist/mongoose/types';

export type UploadCSVProps = {
    formProps: Props;
    setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
    csvFields: string[];
    setCsvFields: React.Dispatch<React.SetStateAction<string[]>>;
    refetchBatchMemberships: () => Promise<void>;
    membershipData?: PaginatedDocs<Membership>;
};

const UploadCSV = React.forwardRef<HTMLElement, UploadCSVProps>(function UploadCSV(
    { formProps, setIsValid, csvFields, setCsvFields, refetchBatchMemberships, membershipData },
    ref
) {
    const { id } = useDocumentInfo();
    const { value: templateId } = useField<string>({ path: 'template' });
    const [templateFields, setTemplateFields] = useState<string[]>([]);
    const [template, setTemplate] = useState<MembershipTemplate | undefined>();

    const fieldsIntersection = getFieldsIntersectionFromHandlebarsJsonTemplate(
        csvFields,
        templateFields
    );

    useEffect(() => {
        if (templateId) {
            fetch(`/api/membership-template/${templateId}`)
                .then(res => res.json())
                .then(setTemplate);
        }
    }, [templateId]);

    useEffect(() => {
        if (template) {
            setTemplateFields(
                dedupe([
                    ...getFieldsFromHandlebarsJsonTemplate(
                        JSON.stringify(template.credentialTemplateJson || {})
                    ),
                    ...GUARANTEED_FIELDS.filter(field => field !== 'credentialName'),
                ])
            );
        }
    }, [template]);

    useEffect(
        () =>
            setIsValid(
                (membershipData?.docs.length ?? 0) > 0 &&
                fieldsIntersection.missingInCSV.length === 0
            ),
        [membershipData?.docs.length, fieldsIntersection.missingInCSV.length]
    );

    const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        if (!e.target.files?.[0]) return;

        Papa.parse(e.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: async results => {
                // if no errors and there is data
                if (results?.data?.length > 0 && results?.errors?.length === 0) {
                    const allFields = results?.meta?.fields ?? [];

                    // A field only counts if all entries in the CSV actually have it
                    const includedFields = allFields.filter(field => {
                        return results?.data.every(result => Boolean(result[field]));
                    });

                    // Send parsed csv object to endpoint to create credential records
                    const res = await fetch('/api/create-batch-credentials', {
                        // Adding method type
                        method: 'POST',

                        // Adding body or contents to send
                        body: JSON.stringify({
                            isMembership: true,
                            batchId: id,
                            credentialRecords: results?.data,
                            fields: includedFields,
                        }),
                        // Adding headers to the request
                        headers: { 'Content-type': 'application/json; charset=UTF-8' },
                    });

                    if (res.status === 200) {
                        const { newBatch } = await res.json();
                        setCsvFields(dedupe([...(newBatch?.csvFields ?? []), ...GENERATED_FIELDS]));
                        await refetchBatchMemberships();
                    }
                }

                e.target.value = null;
            },
        });
    };

    const generateCsvForTemplate = () => {
        const csvContent =
            templateFields.filter(field => !GENERATED_FIELDS.includes(field)).join(',') + '\n';

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

        // Pretend to click on a link for the user to prompt download
        const link = document.createElement('a');

        link.setAttribute('download', `${template?.title ?? 'CredentialsTemplate'}.csv`);

        link.href = URL.createObjectURL(blob);

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };

    return (
        <section
            ref={ref}
            className="w-full h-full snap-start flex-shrink-0 p-10 overflow-y-auto upload-csv-wrapper"
        >
            <h2 className="mt-5 text-[--theme-text] text-3xl font-semibold mb-5 font-inter">
                Upload & Manage Earner Information
            </h2>
            {!formProps.readOnly && (
                <>
                    <p className="text-[--theme-text] text-xl font-medium font-inter mb-15">
                        Upload a CSV file to import membership and earner information.
                    </p>

                    <p className="flex gap-2 items-center flex-wrap rounded bg-blue-200 text-black font-roboto px-6 py-2 my-3">
                        <CircleBang className="w-5 h-5" />
                        <span>
                            You <b>MUST</b> include a valid email address under the column{' '}
                            <code className="rounded bg-gray-100 p-1">emailAddress</code> and a
                            valid name under the column{' '}
                            <code className="rounded bg-gray-100 p-1">earnerName</code> for every
                            entry in the CSV
                        </span>
                    </p>

                    {(membershipData?.docs.length ?? 0) > 0 &&
                        csvFields?.length > 0 &&
                        csvFields?.includes('issuanceDate') && (
                            <output className="flex gap-2 items-center flex-wrap rounded bg-blue-200 text-black font-roboto px-6 py-2 my-3">
                                <CircleBang className="w-5 h-5" />
                                <span>
                                    The field <b>issuanceDate</b> is special field that is populated
                                    by the system; if the CSV contains this field, the values will
                                    be ignored.
                                </span>
                            </output>
                        )}

                    <form>
                        <input
                            type={'file'}
                            id={'csvFileInput'}
                            accept={'.csv'}
                            onChange={handleOnChange}
                            className="upload-csv-input"
                        />
                    </form>
                    <button
                        type="button"
                        onClick={generateCsvForTemplate}
                        className="w-full max-w-xs bg-green-500 rounded-xl mb-8 px-4 py-2 text-white font-inter text-xl font-semibold outline-none justify-self-end disabled:opacity-50"
                    >
                        Download Template CSV
                    </button>
                </>
            )}

            {(membershipData?.docs.length ?? 0) > 0 &&
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

            {(membershipData?.docs.length ?? 0) > 0 &&
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
                {id && membershipData && (
                    <BatchMembershipListPreview
                        data={membershipData}
                        refetch={refetchBatchMemberships}
                        readOnly={formProps.readOnly}
                    />
                )}
            </section>
        </section>
    );
});

export default UploadCSV;
