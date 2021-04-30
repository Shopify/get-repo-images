function Modal({usageModal, closeHandler}) {
	const refString = usageModal.usage.length === 1 ? " reference" : " references";

	return (
		<div
			className="modal"
			onClick={event => event.target === event.currentTarget && closeHandler({})}
		>
			<div className="card">
				<div className="modal-header">
					<h2>{usageModal.name}</h2>
					<button onClick={() => closeHandler({})}>
						<svg viewBox="0 0 20 20" width="20px" height="20px" xmlns="http://www.w3.org/2000/svg"><path d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z" fill="currentColor"/></svg>
						<span className="sr-only">Close modal</span>
					</button>
				</div>
				<h3>{usageModal.usage.length} code {refString}</h3>
				<ul className="link-list">
					{usageModal.usage.map((usage, index) => (
						<li key={`usage-${usageModal.path}-${index}`}>
							<a
								rel="noopener noreferrer"
								target="_blank"
								href={`https://github.com/${usageModal.repo}/blob/master/${usage.path}#L${usage.lineNumber}`}
							>
								{usage.path} - L{usage.lineNumber}
							</a>
							<pre>
								<code>
									<span className="lineNo">{usage.lineNumber}</span>  {usage.line}
								</code>
							</pre>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default Modal;
