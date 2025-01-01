import React, { useEffect, useState } from 'react';
//import { sampleData } from './data';
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
							<tr>
								<th className='text-left'>Parent Subscription ID</th>
								<th className='text-left'>Term ID</th>
								<th className='text-left'>User ID</th>
							</tr>
						</thead>
						{/* Table Body */}
						<tbody>
							{data.map((item) => (
								<React.Fragment key={item.subscription_id}>
									{/* Parent Row */}
									<tr className='hover:bg-base-50'>
										<td>{item.subscription_id}</td>
										<td>{item.term_id}</td>
										<td>{item.uid}</td>
									</tr>
									{/* Conditional Mini Table for Child Subscriptions */}
									{item.shared_accounts && item.shared_accounts.length > 0 && (
										<tr>
											<td colSpan='3' className='bg-base-50'>
												<div className='flex justify-end'>
													<div className='w-2/3 p-4'>
														<h4 className='text-lg font-semibold mb-2'>
															Child Subscriptions
														</h4>
														<table className='w-full border-collapse child-table'>
															<thead>
																<tr>
																	<th className='text-left pb-2'>
																		Subscription ID
																	</th>
																	<th className='text-left pb-2'>
																		Child User ID
																	</th>
																	<th className='text-left pb-2'>Email</th>
																</tr>
															</thead>
															<tbody>
																{item.shared_accounts.map((child) => (
																	<tr key={child.account_id}>
																		<td className='py-1'>{child.account_id}</td>
																		<td className='py-1'>{child.user_id}</td>
																		<td className='py-1'>{child.email}</td>
																	</tr>
																))}
															</tbody>
														</table>
													</div>
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
