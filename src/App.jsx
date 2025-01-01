import React, { useEffect, useState } from 'react';
import { sampleData } from './data';

const App = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
 	   setTimeout(() => {
 		   setData(sampleData);
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
								<th className='text-left'>ID</th>
								<th className='text-left'>Shared Subscription</th>
								<th className='text-left'>Description</th>
							</tr>
						</thead>
						{/* Table Body */}
						<tbody>
							{data.map((item) => (
								<React.Fragment key={item.id}>
									{/* Parent Row */}
									<tr className='hover:bg-base-50'>
										<td>{item.id}</td>
										<td>{item.name}</td>
										<td>{item.description}</td>
									</tr>
									{/* Conditional Mini Table for Child Subscriptions */}
									{item.childSubscriptions &&
										item.childSubscriptions.length > 0 && (
											<tr>
												<td colSpan='3' className='bg-base-50'>
													<div className='flex justify-end'>
														<div className='w-2/3 p-4'>
															<h4 className='text-lg font-semibold mb-2'>
																Child Subscriptions
															</h4>
															<table
																className='w-full border-collapse child-table'
															>
																<thead>
																	<tr>
																		<th className='text-left pb-2'>Child ID</th>
																		<th className='text-left pb-2'>Name</th>
																		<th className='text-left pb-2'>Status</th>
																	</tr>
																</thead>
																<tbody>
																	{item.childSubscriptions.map((child) => (
																		<tr key={child.childId}>
																			<td className='py-1'>{child.childId}</td>
																			<td className='py-1'>{child.name}</td>
																			<td className='py-1'>{child.status}</td>
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
