import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/app-bar';

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default MainLayout;
