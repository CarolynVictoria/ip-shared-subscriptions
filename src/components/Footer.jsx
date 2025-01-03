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

export default Footer;
