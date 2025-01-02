import axios from 'axios';

export const fetchSharedSubscriptions = async (
	limit = 5,
	offset = 0,
	status = 'active'
) => {
	const params = {
		aid: 'p6M0eeA44g',
		api_token: 'JuXGiK5rAVFQvJY7zDDKjtxCloTKI28CSuTZKY7D',
		limit,
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
		params: params, // Send query parameters
	};

	try {
		const response = await axios.request(config);
		console.log('Full API Response:', response.data); // Log the response for debugging
		if (response.data && response.data.SharedSubscriptions) {
			console.log('SharedSubscriptions:', response.data.SharedSubscriptions);
			return response.data.SharedSubscriptions; // Access SharedSubscriptions correctly
		} else {
			console.error(
				'SharedSubscriptions not found in response data:',
				response.data
			);
			throw new Error('SharedSubscriptions not found in response data');
		}
	} catch (error) {
		console.error('Error fetching shared subscriptions:', error);
		throw error;
	}

};