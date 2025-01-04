import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { statuses } from '../helpers/statusMapping';

const Header = ({ fetchData }) => {
	const [selectedStatuses, setSelectedStatuses] = useState([]);

	const handleStatusChange = (statusValue) => {
		setSelectedStatuses((prevStatuses) =>
			prevStatuses.includes(statusValue)
				? prevStatuses.filter((item) => item !== statusValue)
				: [...prevStatuses, statusValue]
		);
	};

	const handleFetchClick = () => {
		fetchData(selectedStatuses);
	};

	const handleSelectAll = () => {
		setSelectedStatuses(statuses.map((status) => status.value));
	};

	const handleClearAll = () => {
		setSelectedStatuses([]);
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
						{statuses.map(({ label, value }) => (
							<label
								key={value}
								className='flex items-center space-x-2 text-xs font-medium'
							>
								<input
									type='checkbox'
									aria-label={`Filter by ${label}`}
									checked={selectedStatuses.includes(value)}
									onChange={() => handleStatusChange(value)}
									className='h-3 w-3'
								/>
								<span>{label}</span>
							</label>
						))}
					</div>
					<div className='flex space-x-2 mt-2'>
						<button className='btn btn-secondary' onClick={handleSelectAll}>
							Select All
						</button>
						<button className='btn btn-secondary' onClick={handleClearAll}>
							Clear All
						</button>
					</div>
					<button className='btn btn-primary mt-4' onClick={handleFetchClick}>
						Fetch
					</button>
				</div>
			</div>
		</header>
	);
};

Header.propTypes = {
	fetchData: PropTypes.func.isRequired,
};

export default Header;
