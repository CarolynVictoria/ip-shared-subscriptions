import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({
	currentPage,
	setCurrentPage,
	rowsPerPage,
	setRowsPerPage,
	totalItems,
}) => {
	const totalPages = Math.ceil(totalItems / rowsPerPage);

	const handlePrevious = () => {
		setCurrentPage((prev) => Math.max(prev - 1, 1));
	};

	const handleNext = () => {
		setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	};

	const handleRowsPerPageChange = (e) => {
		const newRowsPerPage = Number(e.target.value);
		setRowsPerPage(newRowsPerPage);
		setCurrentPage(1); // Reset to the first page
	};

	return (
		<div>
			{/* Pagination Controls */}
			<div className='flex justify-between items-center mt-4'>
				<button
					className='btn btn-primary'
					onClick={handlePrevious}
					disabled={currentPage === 1}
					aria-label='Go to previous page'
				>
					Previous
				</button>
				<span>
					Page {currentPage} of {totalPages}
				</span>
				<button
					className='btn btn-primary'
					onClick={handleNext}
					disabled={currentPage === totalPages || totalPages === 0}
					aria-label='Go to next page'
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
					onChange={handleRowsPerPageChange}
					aria-label='Select number of rows per page'
				>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={50}>50</option>
				</select>
			</div>
		</div>
	);
};

Footer.propTypes = {
	currentPage: PropTypes.number.isRequired,
	setCurrentPage: PropTypes.func.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
	setRowsPerPage: PropTypes.func.isRequired,
	totalItems: PropTypes.number.isRequired,
};

export default Footer;
