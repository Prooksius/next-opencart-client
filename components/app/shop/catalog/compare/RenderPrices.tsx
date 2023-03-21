import { TProduct } from "@/store/slices/productsSlice"

export const RenderPrices = ({ product }: { product: TProduct }) => {
	return (
		<>
			{product.price > 0 && (
				<div className="product-item__price">
					{product.special === 0 && (
						<span
							dangerouslySetInnerHTML={{
								__html: product.price_str,
							}}
						></span>
					)}
					{product.special > 0 && (
						<>
							<span
								className="new-price"
								dangerouslySetInnerHTML={{
									__html: product.special_str,
								}}
							></span>
							<span
								className="old-price"
								dangerouslySetInnerHTML={{
									__html: product.price_str,
								}}
							></span>
						</>
					)}
				</div>
			)}
		</>
	)
}
