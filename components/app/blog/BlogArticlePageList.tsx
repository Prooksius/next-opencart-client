import Link from 'next/link'
import { REACT_APP_IMAGE_URL } from '@/config'
import PaginationList, {
	HeaderSlot,
	SortSlot,
} from '@/components/app/shop/global/PaginationList'
import { useRouter } from 'next/router'
import { SortOrderBlog } from './SortOrderBlog'
import { TBlogArticles, TPageChangeHandler, TStatus } from 'types'

interface BlogArticlePageListProps {
	articles: TBlogArticles
	status: TStatus
	pageChangeHandler: TPageChangeHandler
}

export const BlogArticlePageList = ({
	articles,
	status,
	pageChangeHandler,
}: BlogArticlePageListProps) => {
	const router = useRouter()

	return (
		<>
			<PaginationList
				loadedPage={+articles.page}
				listStatus={status}
				containerClass={'notes-container'}
				listClass={'blog-article__block'}
				itemsCount={+articles.count}
				itemsInPage={+articles.limit}
				pageChangedCallback={pageChangeHandler}
			>
				<HeaderSlot></HeaderSlot>
				<SortSlot>
					<SortOrderBlog />
				</SortSlot>
				<div className="blog-article__list">
					{articles.list.map((item) => (
						<Link href={'/blogpost/' + item.alias} key={item.id}>
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
			</PaginationList>
		</>
	)
}
