import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'text/plain';
const backend = axios;
export default backend;
