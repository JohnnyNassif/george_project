import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { getHistory, downloadFile,downloadConfigFile } from '../../network/data-files';
import CustomizedDialogs from '../../components/Dialog';
import Link from "@material-ui/core/Link";
import Chip from "@material-ui/core/Chip";




const History = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false)
  const [configData, setConfigData] = useState('');

  const columns = [
    { field: 'fileName', headerName: 'File name', width: 300 },
    {
      field: 'resultfile', headerName: 'Result file', width: 300,
      field: "Action", width: 150,
      renderCell: (props) => {
        const { row } = props;
        const { resultfile } = row
        return (
          <Chip label={resultfile} variant="outlined" onClick={() => {
            handleResultFileClick(resultfile);
          }} />
        );
      }
    },
    {
      field: 'configfile', headerName: 'Config file', width: 300,
      renderCell: (props) => {
        const { row } = props;
        const { configfile } = row
        return (
          <Chip label={configfile} variant="outlined" onClick={() => {
            handleConfigFileClick(configfile);
          }} />
        );
      }
    },
    { field: 'timeStamp', headerName: 'Time', width: 300 }
    // {
    //   field: "Action", width: 150,
    //   renderCell: (props) => {
    //     const {row}=props;
    //     const{settings}=row
    //     return (
    //       <Button
    //         variant="contained"
    //         color="primary"
    //         onClick={(event) => {
    //           handleClick(event,settings);
    //         }}
    //       >
    //         View settings
    //       </Button>
    //     );
    //   }
    // }
  ]

  // const handleCellClick = (param, event) => {
  //   event.stopPropagation();
  // };

  // const handleRowClick = (param, event) => {
  //   event.stopPropagation();
  // };

  const handleClick = (event, settings) => {
    console.log(settings)
    setConfigData(settings)
    setOpen(true)
  };

  const handleOnCellClick = (params) => {
    //console.log(params.row.settings);
    console.log(params.row);
    //var obj = JSON.parse(params.row.settings);

    //setConfigData(JSON.stringify(obj));
    //console.log(configData);
    //var settings = JSON.parse(obj.data);
    //console.log(settings);
  };


  const handleResultFileClick = async (resultfile) => {
    console.log(resultfile)
    await downloadFile(resultfile);
  };

  const handleConfigFileClick = async (configfile) => {
    console.log(configfile)
    await downloadConfigFile(configfile);
  };

  const fetchData = useCallback(async () => {
    //const response= await call-the-api
    //  const resDate=respone.data;
    //   setData(resData)
    const response = await getHistory();
    setData(response.History);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={data} columns={columns} />
      {/* <CustomizedDialogs open={open} setOpen={setOpen}>
        {configData}
      </CustomizedDialogs> */}
    </div>
  )
};

export default History;
