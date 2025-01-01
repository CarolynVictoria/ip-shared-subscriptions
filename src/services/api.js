import axios from 'axios';

const API_BASE_URL = 'http://localhost:5555';

export const fetchResource = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL}/api/resource`);
		return response.data;
	} catch (error) {
		console.error('Error fetching resource:', error);
		throw error;
	}
};
