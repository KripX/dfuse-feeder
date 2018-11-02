import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'text/plain';
let backend = axios;
export default backend;
