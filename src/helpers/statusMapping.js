export const statuses = [
	{ label: 'Active', value: 'active' },
	{ label: 'Cancelled', value: 'canceled' },
	{ label: 'Completed', value: 'completed' },
	{ label: 'Expired', value: 'expired' },
	{ label: 'Payment Failed', value: 'payment failure' },
	{ label: 'Upgraded', value: 'upgraded' },
];

/**
 * Returns a mapping of human-readable labels to API-friendly values.
 * Example: { "Active": "active", "Cancelled": "cancelled", ... }
 */
export const getStatusMapping = () =>
	Object.fromEntries(statuses.map(({ label, value }) => [label, value]));

/**
 * Returns an array of all API-friendly status values.
 * Example: ["active", "cancelled", "completed", ...]
 */
export const getStatusValues = () => statuses.map(({ value }) => value);
