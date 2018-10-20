import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 , retryDelay: (retryCount) => {
  return retryCount * 1500;
}});
axios.defaults.headers.post['Content-Type'] = 'text/plain';
const backend = axios;

export default backend;
