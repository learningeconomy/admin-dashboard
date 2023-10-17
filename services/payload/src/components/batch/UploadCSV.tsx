import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { useDocumentInfo } from 'payload/components/utilities';
import BatchCredentialListPreview from '../List/BatchCredentialListPreview';

const UploadCSV = React.forwardRef<HTMLElement>(function UploadCSV(_props, ref) {
    const { id } = useDocumentInfo();
    const [data, setData] = useState();

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
                        }),
                        // Adding headers to the request
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        },
                    });
                    console.log('///res', res);

                    if (res.status === 200) {
                        const { data } = await res.json();
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

            <section>
                {id && data && (
                    <BatchCredentialListPreview data={data} refetch={fetchBatchCredentials} />
                )}
            </section>
        </section>
    );
});

export default UploadCSV;
