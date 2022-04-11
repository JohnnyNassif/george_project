import { Box, Button, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import DropZoneUploadInput from '../../components/drop-zone-input';
import SendIcon from '@mui/icons-material/Send';
import PageTitle from '../../components/page-title';
import {
    postDataFile, postDataFileNew, postConfigFileNew, getAllConfigFiles,
    postResultFile, downloadFile, downloadConfigFile
} from '../../network/data-files';
import Loader from '../../components/loader';

const FilesUpload = () => {
    const [configFile, setConfigFile] = useState({});
    const [dataFile, setDataFile] = useState({});
    const [showLoader, setShowLoader] = useState(false);
    const [dataFileName, setDataFileName] = useState('')
    const [configFileName, setConfigFileName] = useState('')
    const [selectedConfigFile, setSelectedConfigFile] = useState('')
    const [allConfigFiles, setAllConfigFiles] = useState([]);

    const onDataDropZoneChange = (arr) => {
        if (arr && arr.length) {
            const file = arr[0];
            setDataFile(file);
            const { name } = file;
            setDataFileName(name)
        }
    };

    const onConfigDropZoneChange = (arr) => {
        if (arr && arr.length) {
            const file = arr[0];
            setConfigFile(file);
            const { name } = file;
            setConfigFileName(name);
            setSelectedConfigFile(name);
        }
    };

    const onDataSendClick = async () => {
        try {
            setShowLoader(true);
            const response = await postDataFileNew(dataFile);
        } catch (error) {
            console.error(error);
        } finally {
            setShowLoader(false);
        }
    };

    const onConfigSendClick = async () => {
        try {
            setShowLoader(true);
            const response = await postConfigFileNew(configFile);
            fetchData();
            setSelectedConfigFile(configFileName);

        } catch (error) {
            console.error(error);
        } finally {
            setShowLoader(false);
        }
    };

    const onProcessFileClick = async () => {
        try {
            console.log('Click on the process button');
            const response = await postResultFile(configFileName, dataFileName);
            console.log(response);
            console.log('Calling the download api');
            await downloadFile(dataFileName);

        } catch (error) {
            console.error(error);
        } finally {

        }
    };

    const handleConfigListChange = (event) => {
        setSelectedConfigFile(event.target.value);
        setConfigFileName(event.target.value);
        console.log(event.target.value);
        console.log(selectedConfigFile);
    }

    const fetchData = useCallback(async () => {
        const response = await getAllConfigFiles();
        console.log(response);
        setAllConfigFiles(response);
        setSelectedConfigFile(response[0])
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Grid container>
            <Grid item xs={6}>
                <Box sx={{ display: 'flex', overflow: 'hidden' }}>
                    <Box sx={{ margin: '5% 10% 0% 10%', width: '400px' }}>
                        <DropZoneUploadInput
                            handleDropZoneChange={onDataDropZoneChange}
                            accept='.csv'
                            typeoffile='DATA'
                        />
                        {dataFileName && <span>{dataFileName} is selected</span>}
                        <Box display='flex' justifyContent='right' mt={4}>
                            <Button
                                variant='contained'
                                onClick={onDataSendClick}
                                endIcon={<SendIcon />}
                            >
                                Send
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box sx={{ display: 'flex', overflow: 'hidden' }}>
                    <Box sx={{ margin: '5% 10% 0% 10%', width: '400px' }}>
                        <DropZoneUploadInput
                            handleDropZoneChange={onConfigDropZoneChange}
                            accept='.csv'
                            typeoffile='CONFIG'
                        />
                        {configFileName && <span>{configFileName} is selected</span>}
                        <Box display='flex' justifyContent='right' mt={4}>
                            <Box display='flex'  >
                                <InputLabel sx={{ margin: '0% 0% 10% 30%', width: '200px',height:'50px' }} ><b>Select config</b> </InputLabel>
                                <Select sx={{ margin: '0% 2% 0% 0%', width: '250px',height:'40px' }} value={selectedConfigFile}
                                    onChange={handleConfigListChange} >
                                    {allConfigFiles?.map(option => {
                                        return (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>

                            </Box>
                            <Box>
                                <Button justifyContent='right' mt={2}
                                    variant='contained'
                                    onClick={onConfigSendClick}
                                    endIcon={<SendIcon />}
                                >
                                    Send
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Grid>
            <Box display='flex' sx={{ margin: '1% 0% 0% 30%' }} justifyContent='right' mt={2}>
                <Button sx={{ width:'400px'}}
                    variant='contained'
                    onClick={onProcessFileClick}
                    endIcon={<SendIcon />}
                >
                    Process file
                </Button>
            </Box>
            {showLoader && <Loader />}
        </Grid>
    );
};
export default FilesUpload;
