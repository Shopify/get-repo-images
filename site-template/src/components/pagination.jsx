const maxPagination = 9;
const midPagination = Math.floor(maxPagination/2);

function Pagination({currentPage, totalPages, setPage}) {
	if(totalPages === 0) {
		return null
	}
	const pages = [...new Array(totalPages + 1).keys()];

	let pagination;
	if (totalPages < maxPagination) {
		pagination = pages;
	} else if(currentPage < midPagination) {
		pagination = pages.slice(0, 0 + maxPagination);
	// Left to right active state
	} else {
		pagination = pages.slice(currentPage - midPagination, currentPage + maxPagination - midPagination)
	}

	// Add items to the array if we are at the end
	if(totalPages >= maxPagination && pagination.length < maxPagination){
		const totalMissing = maxPagination - pagination.length;
		const lastItem = pagination[0];
		const missingItems = Array(totalMissing).fill().map((_, i) => lastItem - i);
		pagination.unshift(...missingItems);
	}

	const handlePagination = pageNumber => {
		window.scrollTo(0, 0);
		setPage(pageNumber);
	}

	return (
		<ul className="pagination">
			<li>
				<button className="card" onClick={() => handlePagination(0)}>
					First
				</button>
			</li>
			{pagination.map(i =>
				<li key={i}>
					<button
						className={`card ${i === currentPage && 'card--active'}`}
						onClick={() => handlePagination(i)}>{i + 1}</button>
				</li>
			)}
			<li>
				<button className="card" onClick={() => handlePagination(totalPages)}>
					Last
				</button>
			</li>
		</ul>
	);
}

export default Pagination;
