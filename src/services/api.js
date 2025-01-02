import axios from 'axios';

export const fetchSharedSubscriptions = async (
	page = 1,
	rowsPerPage = 10,
	status = 'active'
) => {
	const offset = (page - 1) * rowsPerPage; // Calculate offset based on page and rowsPerPage

	const params = {
		aid: 'p6M0eeA44g',
		api_token: 'JuXGiK5rAVFQvJY7zDDKjtxCloTKI28CSuTZKY7D',
		limit: rowsPerPage,
		offset,
		status,
	};

	const config = {
		method: 'get',
		url: '/external-api/publisher/subscription/share/list', // Use the backend proxy
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json',
		},
		params, // Send query parameters
	};

	try {
		const response = await axios.request(config);
		if (response.data && response.data.SharedSubscriptions) {
			return response.data.SharedSubscriptions; // Return SharedSubscriptions
		} else {
			throw new Error('SharedSubscriptions not found in response data');
		}
	} catch (error) {
		console.error('Error fetching shared subscriptions:', error);
		throw error;
	}
};
