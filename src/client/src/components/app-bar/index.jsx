import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  const handleConfigClick = () => {
    navigate('/config-upload');
  };

  const handleDataClick = () => {
    navigate('/data-upload');
  };

  const handleHistoryClick = () => {
    navigate('/history');
  };

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            CSV Converter
          </Typography>

          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* <Button
              onClick={handleConfigClick}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Upload Config file
            </Button> */}
            <Button
              onClick={handleDataClick}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Upload data file
            </Button>
            <Button
              onClick={handleHistoryClick}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              History
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
