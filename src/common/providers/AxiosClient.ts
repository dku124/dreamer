import axios from 'axios';

const AxiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  headers: {
    'Content-Type': 'application/json', 
	  'Accept': 'application/json',
	  'key': '7SyHoM4gjRGYi1p',
  }, 
	timeout: 1000000,
});
AxiosClient.interceptors.request.use(async (config) => {
    if(config.params){
        // remove empty params
        Object.keys(config.params).forEach((key) => {
            if (config.params[key] === '') {
                delete config.params[key];
            }
        });
    }
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});
AxiosClient.interceptors.response.use((response) => {
	
	
	
    if (response && response.data) {
      return response.data;
    }
    return response;
  }, (error) => {
	if (error.response && error.response.data) {
		switch (error.response.status) {
			case 401:
				localStorage.clear();
				// navigate('/login');
				location.href = "/";
				break;
			default:
				break;
		}
	}
    // Handle errors
    throw error.response.data;
});
export default AxiosClient;


