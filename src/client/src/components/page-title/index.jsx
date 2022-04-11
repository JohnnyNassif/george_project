import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

const PageTitle = ({ title }) => {
  return (
    <Box>
      <Grid container direction='row' spacing={1} alignItems='center'>
        <Grid item></Grid>
        <Grid item>
          <Typography variant='pageTitle'>{title}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
export default PageTitle;
