import React from 'react';

const Footer = ({
	currentPage,
	setCurrentPage,
	rowsPerPage,
	setRowsPerPage,
}) => {
	return (
		<div>
			{/* Pagination Controls */}
			<div className='flex justify-between items-center mt-4'>
				<button
					className='btn btn-primary'
					onClick={() => {
						console.log('Current page before Previous:', currentPage);
						setCurrentPage((prev) => Math.max(prev - 1, 1));
					}}
					disabled={currentPage === 1}
				>
					Previous
				</button>
				<button
					className='btn btn-primary'
					onClick={() => {
						console.log('Current page before Next:', currentPage);
						setCurrentPage((prev) => prev + 1);
					}}
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
					onChange={(e) => {
						const newRowsPerPage = Number(e.target.value);
						console.log('Rows per page updated to:', newRowsPerPage);
						setRowsPerPage(newRowsPerPage);
					}}
				>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={50}>50</option>
				</select>
			</div>
		</div>
	);
};

export default Footer;
