import axios from 'axios';

const getAxiosInstance = () => {
  const axiosClient = axios.create();
  axiosClient.defaults.baseURL = 'http://localhost:4000/api/';
  return axiosClient;
};

export default getAxiosInstance;
