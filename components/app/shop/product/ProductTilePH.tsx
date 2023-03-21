export const ProductTilePH = () => {
	return (
		<li className="list-group-item product-item">
			<div className="product-item__tile">
				<span className="image">
					<span
						className="skeleton-box"
						style={{ width: '100%', paddingBottom: '100%' }}
					></span>
				</span>
				<span className="product-item__properties">
					<span className="product-item__property title">
						<span className="skeleton-box" style={{ width: '70%' }}></span>
					</span>
					<span className="product-item__property attrinutes">
						<span className="product-tile_attrs">
							<span className="product-attrs__group">
								<span
									className="skeleton-box"
									style={{ width: '40%', height: '32px', borderRadius: '40px' }}
								></span>
								<span
									className="skeleton-box"
									style={{ width: '50%', height: '32px', borderRadius: '40px' }}
								></span>
								<span
									className="skeleton-box"
									style={{ width: '35%', height: '32px', borderRadius: '40px' }}
								></span>
							</span>
						</span>
					</span>
					<span className="product-item__property price">
						<span className="skeleton-box" style={{ width: '50%', height: '27px' }}></span>
					</span>
				</span>
			</div>
		</li>
	)
}
