import classNames from 'classnames'

export const PriceBlock = ({ product }) => {
	return (
		<div className="product-prices">
			{product.special > 0 && (
				<span
					className="product-price product-price__new"
					dangerouslySetInnerHTML={{
						__html: product.special_str,
					}}
				></span>
			)}
			<span
				className={classNames('product-price', {
					'product-price__old': product.special > 0,
				})}
				dangerouslySetInnerHTML={{
					__html: product.price_str,
				}}
			></span>
		</div>
	)
}
