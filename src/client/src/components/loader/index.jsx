import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loader = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        transform: '-webkit-translate(-50%, -50%)',
        transform: ' -moz-translate(-50%, -50%)',
        transform: '-ms-translate(-50%, -50%)',
        zIndex: '9999999',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
