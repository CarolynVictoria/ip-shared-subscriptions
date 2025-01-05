import React, { useState, useEffect } from 'react';
import { fetchMergedSubscriptionData } from './services/api';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { getStatusMapping } from './helpers/statusMapping';

const App = () => {
	const [fullData, setFullData] = useState([]); // Store the full dataset
	const [filteredData, setFilteredData] = useState([]); // Store filtered results
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [filters, setFilters] = useState({ statuses: [] });

	// Fetch the full dataset once on app load
	const fetchData = async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await fetchMergedSubscriptionData(); // Fetch full dataset
			setFullData(data); // Store the full dataset locally
			setFilteredData(data); // Initialize filteredData with full dataset
		} catch (err) {
			setError(err.message);
			setFullData([]);
			setFilteredData([]);
		} finally {
			setLoading(false);
		}
	};

	// Apply local filtering based on selected statuses
const applyFilters = (selectedStatuses = []) => {
	// Filter the dataset based on the selected statuses
	const newFilteredData = selectedStatuses.length
		? fullData.filter((item) =>
				selectedStatuses.includes(item.status_name_in_reports)
		  )
		: fullData;

	// Update the state only if filtered data has changed
	if (JSON.stringify(newFilteredData) !== JSON.stringify(filteredData)) {
		setFilteredData(newFilteredData);
	}
};

	// Effect to fetch data once when the component mounts
	useEffect(() => {
		fetchData();
	}, []);

	// Paginate the filtered dataset
	const paginatedData = filteredData.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

	return (
		<div className='p-8 bg-base-100 min-h-screen text-base-content'>
			<Header
				onFilterChange={(selectedStatuses) => {
					setFilters({ statuses: selectedStatuses });
					applyFilters(selectedStatuses);
				}}
			/>
			{loading ? (
				<div className='flex justify-center items-center'>
					<button className='btn btn-outline loading'>Loading...</button>
				</div>
			) : error ? (
				<div className='flex justify-center items-center text-red-500'>
					{error}
				</div>
			) : (
				<div className='overflow-x-auto'>
					<table className='table w-full'>
						<thead>
							<tr className='text-white bg-gray-700'>
								<th className='text-left'>Subscription ID</th>
								<th className='text-left'>Term</th>
								<th className='text-left'>User ID</th>
								<th className='text-left'>Name</th>
								<th className='text-left'>Email</th>
								<th className='text-left'>Total Tokens</th>
								<th className='text-left'>Redeemed</th>
								<th className='text-left'>Unused</th>
								<th className='text-left'>Status</th>
							</tr>
						</thead>
						<tbody>
							{paginatedData.map((item) => (
								<React.Fragment key={item.subscription_id}>
									<tr className='text-gray-700 font-bold'>
										<td className='align-top'>{item.subscription_id}</td>
										<td className='align-top'>{item.term_name}</td>
										<td className='align-top'>{item.uid}</td>
										<td className='align-top'>
											{item.parent_first_name} {item.parent_last_name}
										</td>
										<td className='align-top'>{item.parent_email}</td>
										<td className='align-top'>{item.total_tokens}</td>
										<td className='align-top'>{item.redeemed_tokens}</td>
										<td className='align-top'>{item.unused_tokens}</td>
										<td className='align-top'>
											{item.status_name_in_reports || 'Status not available'}
										</td>
									</tr>
									{item.shared_accounts?.length > 0 && (
										<tr>
											<td colSpan={9} className='p-4'>
												<div className='w-full ml-60 p-4 rounded-lg overflow-x-auto'>
													<table className='table w-full'>
														<thead>
															<tr className='bg-base-200'>
																<th className='text-left text-base-400 pb-2 w-[20%]'>
																	Child Subscription ID
																</th>
																<th className='text-left text-base-400 pb-2 w-[20%]'>
																	Child User ID
																</th>
																<th className='text-left text-base-400 pb-2 w-[30%]'>
																	Child Email
																</th>
															</tr>
														</thead>
														<tbody>
															{item.shared_accounts.map((child) => (
																<tr key={child.account_id}>
																	<td className='py-1 break-words'>
																		{child.account_id}
																	</td>
																	<td className='py-1 break-words'>
																		{child.user_id}
																	</td>
																	<td className='py-1 break-words'>
																		{child.email}
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											</td>
										</tr>
									)}
								</React.Fragment>
							))}
						</tbody>
					</table>
				</div>
			)}
			<Footer
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
				totalItems={filteredData.length}
			/>
		</div>
	);
};

export default App;
