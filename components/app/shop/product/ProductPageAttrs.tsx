import { TProductAttributeGroup } from '@/store/slices/productsSlice'
import { REACT_APP_IMAGE_URL } from 'config'
import Image from 'next/image'

interface ProductPageAttrsProps {
  attributes: TProductAttributeGroup[]
  productId: number
}

export const ProductPageAttrs = ({ attributes, productId }: ProductPageAttrsProps) => {
	return (
		<div className="product-page_attrs">
			{attributes.map((group) => (
				<div
					className="product-page-attrs__group"
					key={productId + '-' + group.attribute_group_id}
				>
					<h4>{group.name}</h4>
					{group.attribute.map((attribute) => (
						<div
							className="prodict-page-attribute"
							key={
								productId +
								'-' +
								group.attribute_group_id +
								'-' +
								attribute.attribute_id
							}
						>
							<Image
								src={REACT_APP_IMAGE_URL + attribute.icon}
								alt={attribute.name}
								width="24px"
								height="24px"
							/>
							<span className="attr-name">{attribute.name}</span>
							<span className="attr-text">{attribute.text}</span>
						</div>
					))}
				</div>
			))}
		</div>
	)
}
