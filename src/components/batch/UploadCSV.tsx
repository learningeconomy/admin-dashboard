
import React, { useEffect, useState } from "react";

const UploadCSV: React.FC = () => {

    const [file, setFile] = useState();

    const fileReader = new FileReader();

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                const csvOutput = event.target.result;
            };

            fileReader.readAsText(file);
        }
    };

    return(
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


        </div>
    )
}

export default UploadCSV;