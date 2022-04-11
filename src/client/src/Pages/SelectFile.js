import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import AddIcon from '@material-ui/icons/Add';

function SelectFile() {
  return (
    <div className="App">
      <Button variant="contained" component="label" color="primary">
        {" "}
        <AddIcon/> Upload a file
        <input type="file" hidden />
      </Button>
    </div>
  )
}

export default SelectFile;
