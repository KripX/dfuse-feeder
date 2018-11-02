import axios from 'axios';
import axiosRetry from 'axios-retry';

axios.defaults.headers.post['Content-Type'] = 'text/plain';
let backend = axios;
export default backend;
