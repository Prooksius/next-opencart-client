import { TProductAttributeGroup } from '@/store/slices/productsSlice'
import { REACT_APP_IMAGE_URL } from 'config'
import Image from 'next/image'

interface ProductTileAttrsProps {
	attributes: TProductAttributeGroup[]
	productId: number
}

export const ProductTileAttrs = ({ attributes, productId }: ProductTileAttrsProps) => {
	return (
		<div className="product-tile_attrs">
			{attributes.map((group) => (
				<div
					className="product-attrs__group"
					key={productId + '-' + group.attribute_group_id}
				>
					{group.attribute.map((attribute) => (
						<div
							className="selected-filters__item prodict-attribute"
							data-tip={attribute.name}
							data-for="for-top"
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
							{attribute.text}
						</div>
					))}
				</div>
			))}
		</div>
	)
}
