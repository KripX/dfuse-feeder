import axios from 'axios';
import axiosRetry from 'axios-retry';

axios.defaults.headers.post['Content-Type'] = 'text/plain';
let backend = axios;
axiosRetry(backend, { retryDelay: (retryCount) => {
  return retryCount * 1500;
}});

export default backend;
