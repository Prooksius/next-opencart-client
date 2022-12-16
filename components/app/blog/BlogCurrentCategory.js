import Link from 'next/link'
import { REACT_APP_IMAGE_URL } from 'config'
import Image from 'next/image'

export const BlogCurrentCategory = ({ category }) => {
	return (
		<div className="current-category_annotation">
			<div className="current-category_annotation-image">
				<div className="image-cont">
					<Image
						src={REACT_APP_IMAGE_URL + category.image}
						alt={category.name}
						layout="responsive"
						width={'100%'}
						height={'100%'}
						objectFit="cover"
					/>
				</div>
			</div>
			<div className="current-category_annotation-desc">
				<div
					className="current-category_description"
					dangerouslySetInnerHTML={{
						__html: category.description,
					}}
				></div>
			</div>
		</div>
	)
}
