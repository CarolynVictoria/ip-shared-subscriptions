import axios from 'axios';

/**
 * Fetch all shared subscriptions without pagination
 */
export const fetchSharedSubscriptions = async () => {
	const limit = 800; 
	const offset = 0; // Start from the beginning
	let allData = [];
	let hasMore = true;

	try {
		while (hasMore) {
			const data = new URLSearchParams({
				aid: process.env.REACT_APP_PIANO_AID,
				api_token: process.env.REACT_APP_PIANO_API_TOKEN,
				limit,
				offset,
			});

			const config = {
				method: 'post',
				url: '/external-api/publisher/subscription/share/list',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Accept: 'application/json',
				},
				data,
			};

			const response = await axios.request(config);

			if (response.data && Array.isArray(response.data.SharedSubscriptions)) {
				allData = [...allData, ...response.data.SharedSubscriptions];
				hasMore = false; // Stop after the first batch (test purpose)
			} else {
				throw new Error('SharedSubscriptions not found in response data');
			}
		}

		return allData;
	} catch (error) {
		throw new Error(`Error fetching shared subscriptions: ${error.message}`);
	}
};

/**
 * Fetch user details by UID
 */
export const fetchUserDataByUid = async (uid) => {
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

		const { code, user } = response.data || {};
		if (code === 0) {
			return user;
		}
		if (code === 2004) {
			return null; // User not found
		}
		throw new Error(`User call responded with code: ${code}`);
	} catch (error) {
		throw error;
	}
};

/**
 * Fetch parent subscription data by subscription ID
 */
export const fetchParentSubscriptionData = async (subscriptionId) => {
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

		if (response.data && response.data.subscription) {
			return response.data.subscription;
		} else {
			throw new Error('Subscription not found in response');
		}
	} catch (error) {
		throw error;
	}
};

/**
 * Fetch and merge all subscriptions with user and parent subscription details
 */
export const fetchMergedSubscriptionData = async () => {
	try {
		// Fetch all shared subscriptions
		const sharedSubscriptions = await fetchSharedSubscriptions();

		// Merge data with user and parent subscription details
		const merged = await Promise.all(
			sharedSubscriptions.map(async (sub) => {
				let user = {};
				let parentSubData = {};

				// Fetch user data by UID
				try {
					user = await fetchUserDataByUid(sub.uid);
				} catch (error) {
					// Handle user fetch error silently
				}

				// Fetch parent subscription details
				try {
					parentSubData = await fetchParentSubscriptionData(
						sub.subscription_id
					);
				} catch (error) {
					// Handle parent subscription fetch error silently
				}

				// Combine data
				const { status_name_in_reports, term } = parentSubData || {};
				return {
					...sub,
					parent_email: user?.email,
					parent_first_name: user?.first_name,
					parent_last_name: user?.last_name,
					status_name_in_reports,
					term_name: term?.name,
				};
			})
		);

		return merged;
	} catch (error) {
		throw error;
	}
};
