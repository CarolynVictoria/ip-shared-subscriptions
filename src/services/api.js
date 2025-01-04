import axios from 'axios';

/**
 * 1) Fetch shared subscriptions (already in place)
 */
export const fetchSharedSubscriptions = async (page = 1, rowsPerPage = 10) => {
	const offset = (page - 1) * rowsPerPage;

	// Use environment variables
	const params = {
		aid: process.env.REACT_APP_PIANO_AID,
		api_token: process.env.REACT_APP_PIANO_API_TOKEN,
		limit: rowsPerPage,
		offset,
	};

	// Log the query parameters
	console.log('Final API request params:', params);

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
		console.log('API response data:', response.data);

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
	// Log the UID
	console.log('Fetching user data for UID:', uid);

	// Build the form data
	const data = new URLSearchParams({
		aid: process.env.REACT_APP_PIANO_AID,
		api_token: process.env.REACT_APP_PIANO_API_TOKEN,
		uid,
	});

	const config = {
		method: 'post',
		url: '/external-api/publisher/user/get',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json',
		},
		data,
	};

	try {
		const response = await axios.request(config);
		console.log('User API response:', response.data);

		const { code, user } = response.data || {};
		if (code === 0) {
			return user;
		}
		if (code === 2004) {
			return null;
		}
		throw new Error(`User call responded with code: ${code}`);
	} catch (error) {
		console.error('Error fetching user data:', error);
		throw error;
	}
};

/**
 * 2.5) Fetch user details by uid (POST request)
 *    Returns an object with { first_name, last_name, email, uid, etc }
 */
export const fetchParentSubscriptionData = async (subscriptionId) => {
	// Log the subscription ID
	console.log('Fetching parent subscription data for ID:', subscriptionId);

	const params = {
		aid: process.env.REACT_APP_PIANO_AID,
		api_token: process.env.REACT_APP_PIANO_API_TOKEN,
		subscription_id: subscriptionId,
	};

	const config = {
		method: 'get',
		url: '/external-api/publisher/subscription/get',
		headers: { Accept: 'application/json' },
		params,
	};

	try {
		const response = await axios.request(config);
		console.log('Parent subscription API response:', response.data);

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
export const fetchMergedSubscriptionData = async (
	page,
	rowsPerPage,
	filters
) => {
	try {
		// Log input parameters
		console.log('Fetching merged subscriptions with:', {
			page,
			rowsPerPage,
			filters,
		});

		const sharedSubscriptions = await fetchSharedSubscriptions(
			page,
			rowsPerPage,
			filters // Pass filters to fetchSharedSubscriptions
		);

		console.log('Fetched shared subscriptions:', sharedSubscriptions);

		const merged = await Promise.all(
			sharedSubscriptions.map(async (sub) => {
				// Fetch user data by UID
				let user = {};
				try {
					user = await fetchUserDataByUid(sub.uid);
					console.log(`Fetched user data for UID ${sub.uid}:`, user);
				} catch (error) {
					console.error(`Error fetching user data for UID ${sub.uid}`, error);
				}
				if (!user) {
					user = {}; // Ensure it doesn't break
				}

				// Fetch parent subscription details
				let parentSubData = {};
				try {
					parentSubData = await fetchParentSubscriptionData(
						sub.subscription_id
					);
					console.log(
						`Fetched parent subscription for ID ${sub.subscription_id}:`,
						parentSubData
					);
				} catch (error) {
					console.error(
						`Error fetching subscription for ID ${sub.subscription_id}`,
						error
					);
				}

				const { status_name_in_reports, term } = parentSubData || {};

				// Log the merged data for this subscription
				const mergedData = {
					...sub,
					parent_email: user?.email,
					parent_first_name: user?.first_name,
					parent_last_name: user?.last_name,
					status_name_in_reports,
					term_name: term?.name,
				};
				console.log('Merged data for subscription:', mergedData);

				return mergedData;
			})
		);

		return merged;
	} catch (error) {
		console.error('Error merging subscription data:', error);
		throw error;
	}
};
