import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import History from './containers/history';
import MainLayout from './layout';
import DataUpload from './containers/data-upload';
import ConfigUpload from './containers/config-upload';
import FilesUpload from './containers/files-upload';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index path='/' element={<History />} />
          <Route path='/history' element={<History />} />
          <Route path='/data-upload' element={<FilesUpload/>} />
          {/* <Route path='/config-upload' element={<ConfigUpload />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
