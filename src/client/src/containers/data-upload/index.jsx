import { Box, Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import DropZoneUploadInput from '../../components/drop-zone-input';
import SendIcon from '@mui/icons-material/Send';
import PageTitle from '../../components/page-title';
import { postDataFile } from '../../network/data-files';
import Loader from '../../components/loader';

const DataUpload = () => {
  const [configFile, setConfigFile] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const[fileName,setFileName]=useState('')

  const onDropZoneChange = (arr) => {
    if (arr && arr.length) {
      const file = arr[0];
      setConfigFile(file);
      const {name}=file;
      setFileName(name)
    }
  };

  const onSendClick = async () => {
    try {
      setShowLoader(true);
      const response = await postDataFile(configFile);
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{ display: 'grid', overflow: 'hidden' }}>
          <Box sx={{ margin: '10% 40% 0% 40%', width: '400px' }}>
            <DropZoneUploadInput
              handleDropZoneChange={onDropZoneChange}
              accept='.csv, .json'
            />
         {  fileName && <span>{fileName} is selected</span>}
            <Box display='flex' justifyContent='center' mt={2}>
              <Button
                variant='contained'
                onClick={onSendClick}
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
      {showLoader && <Loader />}
    </Grid>
  );
};
export default DataUpload;
