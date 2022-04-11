import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const Input = styled('input')({
  display: 'none',
});

const UploadButton = () => {
  const onChange = (e) => {
    const {
      target: { files },
    } = e;
  };

  return (
    <label>
      <Input type='file' onChange={onChange} />
      <Button variant='contained' component='span'>
        Upload
      </Button>
    </label>
  );
};

export default UploadButton;
