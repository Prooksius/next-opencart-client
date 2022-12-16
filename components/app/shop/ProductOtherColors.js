import { REACT_APP_IMAGE_URL } from 'config'
import Image from 'next/image'
import Link from 'next/link'

export const ProductOtherColors = ({ product }) => {
	return (
		<div className=" product-othercolors_block">
			<div className="product-othercolors_title">
				<span>Цвет: </span>
				{product.color_name}
			</div>
			<div className="product-othercolors_list">
				<div className="product-othercolors_item active">
					<Image
						src={REACT_APP_IMAGE_URL + product.images[0].thumb_gallery}
						alt={product.color_name}
						width="70px"
						height="70px"
						objectFit="contain"
					/>
					<span className="product-othercolors_item-color">
						<Image
							src={REACT_APP_IMAGE_URL + product.color_image}
							data-tip={product.color_name}
							data-for="for-top"
							alt={product.color_name}
							width="25px"
							height="25px"
						/>
					</span>
				</div>
				{product.other_colors.map((color) => (
					<div className="product-othercolors_item" key={color.product_id}>
						<Link href={`/product/${color.product_slug}`} shallow={true}>
							<a>
								<Image
									src={REACT_APP_IMAGE_URL + color.product_thumb}
									alt={color.color_name}
									width="70px"
									height="70px"
								/>
								<span className="product-othercolors_item-color">
									<Image
										src={REACT_APP_IMAGE_URL + color.color_image}
										data-tip={color.color_name}
										data-for="for-top"
										alt={color.color_name}
										width="25px"
										height="25px"
									/>
								</span>
							</a>
						</Link>
					</div>
				))}
			</div>
		</div>
	)
}
