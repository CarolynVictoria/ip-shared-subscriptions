import React, { useEffect, useState } from 'react';
import { fetchSharedSubscriptions } from './services/api'; // Import API function

const App = () => {
	const [data, setData] = useState([]); // Data for the current page
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1); // Current page number
	const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetchSharedSubscriptions(currentPage, rowsPerPage); // Fetch data for current page
			setData(response); // Set fetched data
		} catch (err) {
			setError(err.message);
			setData([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [currentPage, rowsPerPage]); // Re-fetch data when currentPage or rowsPerPage changes

	if (loading) {
		return (
			<div className='flex justify-center items-center'>
				<button className='btn btn-outline loading'>Loading...</button>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex justify-center items-center text-red-500'>
				{error}
			</div>
		);
	}

	return (
		<div className='p-8 bg-base-100 min-h-screen text-base-content'>
			<h1 className='text-4xl font-bold text-center mb-8 text-primary'>
				Inside Philanthropy Shared Subscriptions
			</h1>

			{data.length > 0 ? (
				<div className='overflow-x-auto'>
					<table className='table w-full'>
						{/* Table Header */}
						<thead>
							<tr className='text-base-400 bg-base-200 hover:bg-base-100'>
								<th className='text-left'>Parent Subscription ID</th>
								<th className='text-left'>Term ID</th>
								<th className='text-left'>User ID</th>
								<th className='text-left'>Total Tokens</th>
								<th className='text-left'>Redeemed</th>
								<th className='text-left'>Unused</th>
							</tr>
						</thead>
						{/* Table Body */}
						<tbody>
							{data.map((item) => (
								<React.Fragment key={item.subscription_id}>
									{/* Parent Row */}
									<tr>
										<td className='align-top'>{item.subscription_id}</td>
										<td className='align-top'>{item.term_id}</td>
										<td className='align-top'>{item.uid}</td>
										<td className='align-top'>{item.total_tokens}</td>
										<td className='align-top'>{item.redeemed_tokens}</td>
										<td className='align-top'>{item.unused_tokens}</td>
									</tr>
									{/* Child Rows */}
									{item.shared_accounts && item.shared_accounts.length > 0 && (
										<tr>
											<td colSpan={6} className='p-4'>
												<div className='w-[90%] mx-auto p-4 rounded-lg overflow-x-auto'>
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
																	Email
																</th>
																<th className='text-left text-base-400 pb-2 w-[15%]'>
																	Status
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
																	<td className='py-1'>
																		{child.active ? 'Active' : ''}
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
			) : (
				<div className='flex justify-center items-center'>
					<p>No data available</p>
				</div>
			)}

			{/* Pagination Controls */}
			<div className='flex justify-between items-center mt-4'>
				<button
					className='btn btn-primary'
					onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
					disabled={currentPage === 1}
				>
					Previous
				</button>
				<span>Page {currentPage}</span>
				<button
					className='btn btn-primary'
					onClick={() => setCurrentPage((prev) => prev + 1)}
				>
					Next
				</button>
			</div>

			{/* Rows Per Page Selector */}
			<div className='flex justify-center mt-4'>
				<label htmlFor='rowsPerPage' className='mr-2'>
					Rows per page:
				</label>
				<select
					id='rowsPerPage'
					value={rowsPerPage}
					onChange={(e) => setRowsPerPage(Number(e.target.value))}
				>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={50}>50</option>
				</select>
			</div>
		</div>
	);
};

export default App;
