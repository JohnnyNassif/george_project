import axios from 'axios';
import getAxiosInstance from './config';
import download from 'js-file-download';


export const postConfigFile = async (file) => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const form = new FormData();
  form.append('file', file);
  try {
    const response = await getAxiosInstance().post(
      'configupload',
      form,
      headers
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const postDataFile = async (file) => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const form = new FormData();
  form.append('file', file);
  try {
    const response = await getAxiosInstance().post(
      'dataupload',
      form,
      headers
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getHistory = async () => {
  try {
    const response = await getAxiosInstance().get(
      'history'
    );
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postConfigFileNew = async (file) => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const form = new FormData();
  form.append('file', file);
  try {
    const response = await getAxiosInstance().post(
      'testconfigfileupload',
      form,
      headers
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const postDataFileNew = async (file) => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const form = new FormData();
  form.append('file', file);
  try {
    const response = await getAxiosInstance().post(
      'testfileupload',
      form,
      headers
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllConfigFiles = async () => {
  try {
    const response = await getAxiosInstance().get(
      'allconfigfiles'
    );
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postResultFile = async (configfilename, datafilefile) => {
  try {
    const response = await getAxiosInstance().post(
      'resultfile',
      configfilename + '###' + datafilefile
    );
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const downloadFile = async (fileName) => {
  try {
    console.log('enter download method');
    const response = await getAxiosInstance().post(
      'downloadfile',
      fileName
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    //response.download(response.data, fileName);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const downloadConfigFile = async (fileName) => {
  try {
    console.log('enter download method');
    const response = await getAxiosInstance().post(
      'downloadconfigfile',
      fileName
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    //response.download(response.data, fileName);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}
