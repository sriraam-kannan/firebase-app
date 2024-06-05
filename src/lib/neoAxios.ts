import axios from 'axios';

const neoAxios = axios.create({
	baseURL: import.meta.env.VITE_NEO_BASE_URL
});

export default neoAxios;