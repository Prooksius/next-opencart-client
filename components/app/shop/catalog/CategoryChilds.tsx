import Link from 'next/link'
import {
	listParent,
	listCurrent,
	listChilds,
	getFilterLinkQuery,
} from '@/store/slices/categoriesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { REACT_APP_IMAGE_URL } from 'config'
import { useEffect, useState } from 'react'
import { Collapse } from 'react-collapse'
import { listTranslations } from '@/store/slices/globalsSlice'
import { AppDispatch } from '@/store/store'

export const CategoryChilds = () => {
	const childsList = useSelector(listChilds)
	const currentCat = useSelector(listCurrent)
	const parentCat = useSelector(listParent)
	const translations = useSelector(listTranslations)
	const filterLinkQuery = useSelector(getFilterLinkQuery)
	const router = useRouter()
	const dispatch = useDispatch<AppDispatch>()
	const [catsOpen, setCatsOpen] = useState(true)

	useEffect(() => {})

	return (
		<div className="left-filter__category-childs">
			{!parentCat && (
				<h3 className="left-filter__filter-heading">
					<Link
						href={{
							pathname: `/catalog/`,
						}}
					>
						<a>
              <span>{ translations('Catalog')}</span>
						</a>
					</Link>
				</h3>
			)}
			{parentCat && (
				<h3 className="left-filter__filter-heading">
					<Link
						href={{
							pathname: `/catalog/${(router.query.slug as string[]).slice(0, -1).join('/')}`,
						}}
					>
						<a>
							<span>{parentCat?.name}</span>
						</a>
					</Link>
				</h3>
			)}
			{childsList.length > 0 && (
				<>
					<h3
						className="left-filter__filter-heading"
						onClick={() => setCatsOpen((state) => !state)}
					>
						<span>{currentCat?.name}</span>
						<span>
							<Image
								src={REACT_APP_IMAGE_URL + '/upload/image/icons/category.svg'}
								alt={currentCat?.name}
								width="24px"
								height="24px"
							/>
						</span>
					</h3>
					<Collapse isOpened={catsOpen}>
						<div className="left-filter__filter-params_list">
							<ul>
								{childsList.map((item) => (
									<li key={item.id}>
										<Link
											href={{
												pathname: `/catalog/${item.parent_path}`,
												query: filterLinkQuery,
											}}
										>
											<a>
												{item.name}
												<span className="left-filter__filter-num">
													({item.products_count})
												</span>
											</a>
										</Link>
									</li>
								))}
							</ul>
						</div>
					</Collapse>
				</>
			)}
		</div>
	)
}
