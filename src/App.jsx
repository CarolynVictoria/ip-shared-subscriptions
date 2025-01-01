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
							<tr>
								<th className='text-left'>Parent Subscription ID</th>
								<th className='text-left'>Term ID</th>
								<th className='text-left'>User ID</th>
								<th className='text-left'>Child Subscriptions</th>
							</tr>
						</thead>
						{/* Table Body */}
						<tbody>
							{data.map((item) => (
								<tr key={item.subscription_id} className='hover:bg-base-50'>
									{/* Parent Columns */}
									<td className='align-top'>{item.subscription_id}</td>
									<td className='align-top'>{item.term_id}</td>
									<td className='align-top'>{item.uid}</td>
									{/* Child Subscriptions Column */}
									<td>
										{item.shared_accounts && item.shared_accounts.length > 0 ? (
											<div className='bg-base-50 p-4'>
												<table className='w-full border-collapse child-table'>
													<thead>
														<tr>
															<th className='text-left pb-2'>
																Child Subscription ID
															</th>
															<th className='text-left pb-2'>Child User ID</th>
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
										) : (
											<span>No child subscriptions</span>
										)}
									</td>
								</tr>
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
