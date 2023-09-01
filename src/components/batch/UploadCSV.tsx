import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useDocumentInfo } from "payload/components/utilities";
import BatchCredentialListPreview from "../List/BatchCredentialListPreview";
const UploadCSV: React.FC = () => {
  const [file, setFile] = useState();
  const { id } = useDocumentInfo();
  useEffect(() => {
    const fetchBatchCredentials= async () => {
      const res = await fetch("/api/get-batch-credentials", {
        method: "POST",
        body: JSON.stringify({batchId: id}),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
      });
      if (res.status === 200) {
        const { data } = await res.json();
        console.log("///get batch credentials", data);
      }
    };

    fetchBatchCredentials();
  }, []);

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        console.log("///parsed results", results);

        console.log(results.data);
        // if no errors and there is data
        if (results?.data?.length > 0 && results?.errors?.length === 0) {
          // Send parsed csv object to endpoint to create credential records
          const res = await fetch("/api/create-batch-credentials", {
            // Adding method type
            method: "POST",

            // Adding body or contents to send
            body: JSON.stringify({
              batchId: id,
              credentialRecords: results?.data,
            }),
            // Adding headers to the request
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          });
          console.log("///res", res);

          if (res.status === 200) {
            const { data } = await res.json();
            console.log(
              "///create batch creds endpoint test",
              data
            );
          }
        }
      },
    });
  };

  return (
    <div>
      <p>Upload CSV File with earner information</p>
      <form>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <button
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          IMPORT CSV
        </button>
      </form>

      <section>

        <BatchCredentialListPreview />
      </section>
    </div>
  );
};

export default UploadCSV;
