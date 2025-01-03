import React, { useState } from 'react';

const Header = ({ onFilterChange }) => {
	const [selectedStatuses, setSelectedStatuses] = useState([]);

	// List of available statuses for the checkboxes
	const statuses = [
		'Active',
		'Cancelled',
		'Completed',
		'Expired',
		'Failed and Retry',
		'Payment Failure',
		'Renewed',
		'Upgraded',
	];

	const handleStatusChange = (status) => {
		let updatedStatuses;
		if (selectedStatuses.includes(status)) {
			// Remove status if already selected
			updatedStatuses = selectedStatuses.filter((item) => item !== status);
		} else {
			// Add status if not selected
			updatedStatuses = [...selectedStatuses, status];
		}
		setSelectedStatuses(updatedStatuses);

		// Pass the updated statuses to the parent component
		if (onFilterChange) {
			onFilterChange(updatedStatuses);
		}
	};

	return (
		<header className='sticky top-0 z-10 bg-white shadow-sm'>
			<div className='w-full px-4'>
				<h1 className='text-2xl font-bold text-center p-4'>
					Inside Philanthropy Shared Subscriptions
				</h1>
				<div className='flex flex-col items-end border-t py-2 mt-4'>
					<label className='text-md font-medium mb-2'>Filter by Status:</label>
					<div className='flex flex-wrap gap-4 justify-end pb-2'>
						{statuses.map((status) => (
							<label
								key={status}
								className='flex items-center space-x-2 text-xs font-medium'
							>
								<input
									type='checkbox'
									value={status}
									checked={selectedStatuses.includes(status)}
									onChange={() => handleStatusChange(status)}
									className='h-3 w-3'
								/>
								<span>{status}</span>
							</label>
						))}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
