import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import AddIcon from '@material-ui/icons/Add';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const rows = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 3, col1: 'MUI', col2: 'is Amazing' },
  ];
  
  const columns = [
    { field: 'col1', headerName: 'ID' },
    { field: 'col1', headerName: 'Title', width: 300 }
  ]
  

function History() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  )
}

export default History;
