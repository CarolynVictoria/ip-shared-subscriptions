// src/data.js
export const sampleData = [
	{
		id: 1,
		name: 'Parent Subscription A',
		description: 'This is parent A.',
		childSubscriptions: [
			{ childId: 101, name: 'Child Subscription 1', status: 'Active' },
			{ childId: 102, name: 'Child Subscription 2', status: 'Inactive' },
		],
	},
	{
		id: 2,
		name: 'Parent Subscription B',
		description: 'This is parent B.',
		childSubscriptions: [],
	},
	{
		id: 3,
		name: 'Parent Subscription C',
		description: 'This is parent C.',
		childSubscriptions: [
			{ childId: 103, name: 'Child Subscription 3', status: 'Active' },
		],
	},
];
