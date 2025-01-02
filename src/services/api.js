import axios from 'axios';

/**
 * 1) Fetch shared subscriptions (already in place)
 */
export const fetchSharedSubscriptions = async (page = 1, rowsPerPage = 10) => {
	const offset = (page - 1) * rowsPerPage;

	// Use environment variables (prefixed with REACT_APP_ for Create React App)
	const params = {
		aid: process.env.REACT_APP_PIANO_AID,
		api_token: process.env.REACT_APP_PIANO_API_TOKEN,
		limit: rowsPerPage,
		offset,
	};

	const config = {
		method: 'get',
		url: '/external-api/publisher/subscription/share/list',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json',
		},
		params,
	};

	try {
		const response = await axios.request(config);
		if (response.data && response.data.SharedSubscriptions) {
			return response.data.SharedSubscriptions;
		} else {
			throw new Error('SharedSubscriptions not found in response data');
		}
	} catch (error) {
		console.error('Error fetching shared subscriptions:', error);
		throw error;
	}
};

/**
 * 2) Fetch user details by uid (POST request)
 *    Returns an object with { first_name, last_name, email, uid, ... }
 */
export const fetchUserDataByUid = async (uid) => {
	// Build the form data
	const data = new URLSearchParams({
		aid: process.env.REACT_APP_PIANO_AID,
		api_token: process.env.REACT_APP_PIANO_API_TOKEN,
		uid,
	});

	const config = {
		method: 'post',
		url: '/external-api/publisher/user/get', // or your direct Piano URL if not proxying
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json',
		},
		data,
	};

	try {
		const response = await axios.request(config);
		const { code, user } = response.data || {};

		// Typically, code = 0 means OK in Piano's API.
		if (code !== 0) {
			throw new Error(`User call responded with code: ${code}`);
		}

		return user; // e.g. { first_name, last_name, email, uid, ... }
	} catch (error) {
		console.error('Error fetching user data:', error);
		throw error;
	}
};

/**
 * 3) Merge the shared subscription data with each user’s name & email
 *    Calls fetchSharedSubscriptions, then for each item calls fetchUserDataByUid.
 *    Returns a single, unified array of subscriptions with parent_* fields.
 */
export const fetchMergedSubscriptionData = async (
	page = 1,
	rowsPerPage = 10
) => {
	try {
		// 1) Fetch shared subscriptions
		const sharedSubscriptions = await fetchSharedSubscriptions(
			page,
			rowsPerPage
		);

		// 2) For each subscription, fetch user data and combine
		const merged = await Promise.all(
			sharedSubscriptions.map(async (sub) => {
				try {
					const user = await fetchUserDataByUid(sub.uid);
					// Merge the user info into the subscription object
					return {
						...sub,
						parent_email: user.email,
						parent_first_name: user.first_name,
						parent_last_name: user.last_name,
					};
				} catch (error) {
					console.error(`Error fetching user data for UID: ${sub.uid}`, error);
					// Return subscription unmodified if the user call fails
					return sub;
				}
			})
		);

		return merged;
	} catch (error) {
		console.error('Error merging subscription data:', error);
		throw error;
	}
};