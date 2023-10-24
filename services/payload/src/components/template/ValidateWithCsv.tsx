import React, { useState, useEffect, ChangeEventHandler } from 'react';
import Papa from 'papaparse';
import { useField } from 'payload/components/forms';
import {
    getFieldsFromHandlebarsJsonTemplate,
    getFieldsIntersectionFromHandlebarsJsonTemplate,
} from '../../helpers/handlebarhelpers';
import { AUTOMATIC_FIELDS } from '../../helpers/credential.helpers';

const ValidateWithCsv: React.FC = () => {
    const [csvFields, setCsvFields] = useState<string[]>();
    const [templateFields, setTemplateFields] = useState<string[]>([]);
    const { value: template } = useField<string>({ path: 'credentialTemplateJson' });

    const fieldsIntersection = getFieldsIntersectionFromHandlebarsJsonTemplate(
        csvFields ?? [],
        templateFields
    );

    useEffect(() => {
        if (template) {
            setTemplateFields([
                ...getFieldsFromHandlebarsJsonTemplate(JSON.stringify(template)),
                ...AUTOMATIC_FIELDS,
            ]);
        }
    }, [template]);

    const handleOnChange: ChangeEventHandler<HTMLInputElement> = event => {
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: async results => {
                if (results?.data?.length > 0 && results?.errors?.length === 0) {
                    setCsvFields([...(results?.meta?.fields ?? []), ...AUTOMATIC_FIELDS]);
                }
            },
        });
    };

    return (
        <section className="w-full flex-shrink-0 p-10 upload-csv-wrapper">
            {csvFields && fieldsIntersection.missingInTemplate.length > 0 ? (
                <output className="block rounded bg-red-400 text-black font-roboto px-6 py-2 my-3">
                    Template is missing the following fields that were in the CSV:{' '}
                    <span className="font-bold">
                        {fieldsIntersection.missingInTemplate.join(', ')}.
                    </span>
                </output>
            ) : (
                <></>
            )}

            <h2 className="mt-5 text-[--theme-text] text-3xl font-semibold mb-5 font-inter">
                Validate with CSV
            </h2>

            <p className="text-[--theme-text] text-xl font-medium font-inter mb-15">
                Check your JSON template against a sample CSV to ensure all fields are covered.
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

            {csvFields && fieldsIntersection.missingInCSV.length > 0 ? (
                <output className="block rounded bg-red-400 text-black font-roboto px-6 py-2 my-3">
                    CSV is missing the following fields:{' '}
                    <span className="font-bold">{fieldsIntersection.missingInCSV.join(', ')}.</span>
                </output>
            ) : (
                <></>
            )}
        </section>
    );
};

export default ValidateWithCsv;
