import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { useDocumentInfo } from 'payload/components/utilities';
import BatchCredentialListPreview from '../List/BatchCredentialListPreview';

const UploadCSV = React.forwardRef<HTMLElement>(function UploadCSV(_props, ref) {
    const [file, setFile] = useState();
    const { id } = useDocumentInfo();
    const [data, setData] = useState();
    const [refetch, setRefetch] = useState(false);

    // replace this with react-query package...todo
    useEffect(() => {
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

        fetchBatchCredentials();
    }, [refetch]);

    const handleOnChange = e => {
        setFile(e.target.files[0]);
    };

    const handleOnSubmit = e => {
        e.preventDefault();

        Papa.parse(file, {
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
                        }),
                        // Adding headers to the request
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        },
                    });
                    console.log('///res', res);

                    if (res.status === 200) {
                        const { data } = await res.json();
                        setRefetch(true);
                        console.log('///create batch creds endpoint test', data);
                    }
                }
            },
        });
    };

    console.log('///data from state', data);

    return (
        <section ref={ref} className="w-full h-full flex-shrink-0 p-10 upload-csv-wrapper">
            <h2 className="mt-5 text-slate-900 text-3xl font-semibold mb-5 font-inter">
                Upload & Manage Earner Information
            </h2>
            <p className="text-slate-900 text-xl font-medium font-inter mb-15">
                Upload CSV files to import credential and earner information. Once successfully
                uploaded, add or remove earners individually or through CSV files.
            </p>
            <form>
                <input
                    type={'file'}
                    id={'csvFileInput'}
                    accept={'.csv'}
                    onChange={handleOnChange}
                    className="upload-csv-input"
                />
                <button
                    className="upload-csv-button"
                    onClick={e => {
                        handleOnSubmit(e);
                    }}
                >
                    IMPORT CSV
                </button>
            </form>

            <section>
                {id && data && <BatchCredentialListPreview batchId={id} data={data} />}
            </section>
        </section>
    );
});

export default UploadCSV;
