import React, { useState } from 'react';
import axios from 'axios';
import ConfigFileUpload from "./ConfigFileUpload";
import DataFileUpload from "./DataFileUpload";


const FilesUploadPage = () => {
    return (
        <div>
            <ConfigFileUpload/>
            <DataFileUpload/>
        </div>
    )
};

export default FilesUploadPage;
