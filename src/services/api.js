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
 * 2.5) Fetch user details by uid (POST request)
 *    Returns an object with { first_name, last_name, email, uid, ... }
 */
export const fetchParentSubscriptionData = async (subscriptionId) => {
	// Define a "params" object
	const params = {
		aid: process.env.REACT_APP_PIANO_AID,
		api_token: process.env.REACT_APP_PIANO_API_TOKEN,
		subscription_id: subscriptionId, // Must pass subscription_id here
	};

	const config = {
		method: 'get',
		url: '/external-api/publisher/subscription/get',
		headers: { Accept: 'application/json' },
		// This is where you attach your query parameters
		params,
	};

	try {
		const response = await axios.request(config);
		if (response.data && response.data.subscription) {
			return response.data.subscription;
		} else {
			throw new Error('Subscription not found in response');
		}
	} catch (error) {
		console.error('Error fetching parent subscription data:', error);
		throw error;
	}
};

/**
 * 3) Merge the shared subscription data with each user’s name & email
 *    Calls fetchSharedSubscriptions, then for each item calls fetchUserDataByUid.
 *    Returns a single, unified array of subscriptions with parent_* fields.
 */
export const fetchMergedSubscriptionData = async (page, rowsPerPage) => {
	try {
		const sharedSubscriptions = await fetchSharedSubscriptions(
			page,
			rowsPerPage
		);

		const merged = await Promise.all(
			sharedSubscriptions.map(async (sub) => {
				// 1) Fetch user data by UID
				let user = {};
				try {
					user = await fetchUserDataByUid(sub.uid);
				} catch (error) {
					console.error(`Error fetching user data for UID ${sub.uid}`, error);
				}

				// 2) Fetch the parent subscription details
				let parentSubData = {};
				try {
					parentSubData = await fetchParentSubscriptionData(
						sub.subscription_id
					);
				} catch (error) {
					console.error(
						`Error fetching subscription for ID ${sub.subscription_id}`,
						error
					);
				}

				// Pull out the fields you need
				const { status_name_in_reports, term } = parentSubData || {};

				// 3) Merge everything
				return {
					...sub,
					// From user data
					parent_email: user?.email,
					parent_first_name: user?.first_name,
					parent_last_name: user?.last_name,

					// From subscription data
					status_name_in_reports,
					term_name: term?.name, // If 'term' is present and has 'name'
				};
			})
		);

		return merged;
	} catch (error) {
		console.error('Error merging subscription data:', error);
		throw error;
	}
};
