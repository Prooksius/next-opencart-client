import Link from 'next/link'
import { REACT_APP_IMAGE_URL } from 'config'
import Image from 'next/image'

export const BlogSingleArticle = ({ article }) => {
	return (
		<div className="blog-article__single">
			<Image
				src={REACT_APP_IMAGE_URL + article.image}
				alt={article.name}
				layout="responsive"
				width={'100%'}
				height={'100%'}
				objectFit="cover"
			/>
			<br />
			<div
				className="blog-article__content"
				dangerouslySetInnerHTML={{
					__html: article.description,
				}}
			></div>
			<br />
		</div>
	)
}
