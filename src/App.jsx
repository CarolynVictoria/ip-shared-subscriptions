import React, { useEffect, useState } from 'react';
import { fetchMergedSubscriptionData } from './services/api';
import Header from './components/Header.jsx';
import Footer from	'./components/Footer.jsx';

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
			// Replaced fetchSharedSubscriptions with fetchMergedSubscriptionData
			const response = await fetchMergedSubscriptionData(
				currentPage,
				rowsPerPage
			);
			setData(response);
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
			<Header />
			{data.length > 0 ? (
				<div className='overflow-x-auto'>
					<table className='table w-full'>
						{/* Table Header */}
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
						{/* Table Body */}
						<tbody>
							{data.map((item) => (
								<React.Fragment key={item.subscription_id}>
									{/* Parent Row */}
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
										<td className='align-top'>{item.status_name_in_reports}</td>
									</tr>
									{/* Child Rows */}
									{item.shared_accounts && item.shared_accounts.length > 0 && (
										<tr>
											<td colSpan={6} className='p-4'>
												<div className='w-[100%] ml-60 p-4 rounded-lg overflow-x-auto'>
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
			) : (
				<div className='flex justify-center items-center'>
					<p>No data available</p>
				</div>
			)}
			{/* Pagination Controls */}
			<Footer
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
			/>
		</div>
	);
};

export default App;
