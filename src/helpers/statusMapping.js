export const statuses = [
	{ label: 'Active', value: 'active' },
	{ label: 'Cancelled', value: 'cancelled' },
	{ label: 'Completed', value: 'completed' },
	{ label: 'Expired', value: 'expired' },
	{ label: 'Payment Failed', value: 'payment_failed' },
	{ label: 'Upgraded', value: 'upgraded' },
	{ label: 'Wont Renew', value: 'wont_renew' },
];

// Map labels to corresponding API values
export const getStatusMapping = () => {
	return Object.fromEntries(statuses.map(({ label, value }) => [label, value]));
};

// Retrieve all API-friendly status values
export const getStatusValues = () => {
	return statuses.map(({ value }) => value);
};
