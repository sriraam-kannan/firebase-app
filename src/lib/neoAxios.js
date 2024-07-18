import axios from 'axios';

const neoAxios = axios.create({
	baseURL: import.meta.env.VITE_NEO_BASE_URL
});

neoAxios.interceptors.request.use(
	(config) => {
		const neouser = localStorage.getItem('neouser');
		const idToken = localStorage.getItem('idToken');
		const user_email = localStorage.getItem('user_email');

		const parsedNeoUser = JSON.parse(neouser);
		const parsedIdToken = JSON.parse(idToken);
		const parsedUserEmail = JSON.parse(user_email);

		config.headers['neoUser']= `${parsedNeoUser}`;
		config.headers['idToken']= `${parsedIdToken}`;
		config.headers['user_email']= `${parsedUserEmail}`;

		return config;
	},
	(error) => Promise.reject(error)
);

neoAxios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response?.request?.status === 401) {
			localStorage.setItem('neouser', null);
			localStorage.setItem('idToken', null);
			localStorage.setItem('user_email', null);
			localStorage.clear(); //clears all items in local storage.
			window.location.reload();
		}

		return Promise.reject(error);
	}
);

export default neoAxios;
