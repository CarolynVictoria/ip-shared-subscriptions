import React, { useEffect, useState } from 'react';
import { sharedSubscriptionsData } from './data-shared-subscriptions';

const App = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		setTimeout(() => {
			setData(sharedSubscriptionsData);
		}, 1000); // Simulate API delay
	}, []);

	return (
		<div className='p-8 bg-base-100 min-h-screen text-base-content'>
			<h1 className='text-4xl font-bold text-center mb-8 text-primary'>
				Inside Philanthropy Shared Subscriptions
			</h1>

			{data ? (
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
									{/* Child Row */}
									{item.shared_accounts && item.shared_accounts.length > 0 && (
										<tr>
											<td colSpan={6} className='p-4'>
												<div className='w-[90%] mx-auto p-4 rounded-lg overflow-x-auto'>
													<table className='table w-full'>
														<thead>
															<tr className='bg-base-200 '>
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
					<button className='btn btn-outline loading'>Loading...</button>
				</div>
			)}
		</div>
	);
};

export default App;
