import React, { useState } from 'react';
import axios from 'axios';

const ConfigFileUpload = () => {
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");


    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    const uploadFile = async (e) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);
        try {
            const res = await axios({
                method: "post",
                url: "http://localhost:4000/api/configupload",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
              });
            console.log(res);
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <form onSubmit={uploadFile}>
            <input type="file" onChange={saveFile} />
            <input type="submit" value="Upload Config File" />
        </form>
    )
};

export default ConfigFileUpload;
