import Link from 'next/link'
import { REACT_APP_IMAGE_URL } from 'config'
import { TBlogCategory } from 'types'

interface BlogCategoryListProps {
	categories: TBlogCategory[]
}

export const BlogCategoryList = ({ categories }: BlogCategoryListProps) => {
	return (
		<div className="blog-article__block">
			<div className="blog-article__list">
				{categories.map((item) => (
					<Link href={'/blog/' + item.parent_path} key={item.id}>
						<a
							className="blog__tile blog-article__tile"
							style={{
								backgroundImage:
									'url(' + REACT_APP_IMAGE_URL + item.thumb + ')',
							}}
						>
							<h3 className="blog-article__title">{item.name}</h3>
							<span
								className="blog-article__preview"
								dangerouslySetInnerHTML={{
									__html: item.preview,
								}}
							></span>
						</a>
					</Link>
				))}
			</div>
		</div>
	)
}
