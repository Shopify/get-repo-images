import Image from 'next/image';
import prettyBytes from 'pretty-bytes';

function ImageCard({image, referenceOnClick}) {
	return (
		<div className="card">
			<div className="img-wrapper">
				<div className="img-container">
					<Image
						src={`/repo-images/${image.repo}${image.path}`}
						width={400}
						height={200}
						objectFit="scale-down"
						alt=""
					/>
				</div>
			</div>
			<p className="card-meta">
				<span className="small">{prettyBytes(image.size)}</span>
				{
					image.usage ?
						<button
							className="small btn-link"
							title={`View ${image.usage.length === 1 ? " reference" : " references"}`}
							onClick={() => referenceOnClick(image)}
						>
							{image.usage.length}
							{image.usage.length === 1 ? " reference" : " references"}
						</button>
						: <span className="small">No reference</span>
				}
			</p>
			<h2>{image.name}</h2>
			<p className="card-meta">
				<span className="tag">{image.repo}</span>
			</p>
		</div>
	)
};

export default ImageCard;