import React, { useState } from 'react';
import CLoudUploadIcon from '@mui/icons-material/CloudUpload';
import './style.css';

const DropZoneUploadInput = ({
  handleDropZoneChange,
  accept,
  multiple = false,
  typeoffile
}) => {
  const fileInputRef = React.createRef();
  const [hover, setHover] = useState('');

  const fileListToArray = (list) => {
    const arr = [];
    for (let i = 0; i < list.length; i++) {
      arr.push(list.item(i));
    }
    handleDropZoneChange(arr);
  };
  const stopEvent = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    fileListToArray(files);
    setHover(false);
  };

  const onFilesAdded = (e) => {
    const { files } = e.target;
    fileListToArray(files);
  };

  const openFileDialog = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  return (
    <>
      <div
        onDrop={onDrop}
        onDragOver={stopEvent}
        onDragEnter={stopEvent}
        onDragLeave={stopEvent}
        onClick={openFileDialog}
        className={hover ? 'drop-zone-container hover' : 'drop-zone-container'}
      >
        <input
          ref={fileInputRef}
          type='file'
          multiple={multiple}
          onChange={onFilesAdded}
          accept={accept}
        />
        <div className='drag-files'>
          <div>
            <CLoudUploadIcon />
          </div>
          <div className='drag-label'>
            <span> Drag and Drop your {typeoffile} file or browse</span>
          </div>
          <div className='drag-limit'>
            <span> File should be .CSV</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DropZoneUploadInput;
