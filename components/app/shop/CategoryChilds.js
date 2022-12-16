import Link from 'next/link'
import {
	listCurrent,
	listChilds,
	getFilterLinkQuery,
	setFilterChanged,
} from '@/store/slices/categoriesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { REACT_APP_IMAGE_URL } from 'config'
import { useEffect, useState } from 'react'
import { Collapse } from 'react-collapse'

export const CategoryChilds = () => {
	const childsList = useSelector(listChilds)
	const currentCat = useSelector(listCurrent)
	const filterLinkQuery = useSelector(getFilterLinkQuery)
	const router = useRouter()
	const dispatch = useDispatch()
	const [catsOpen, setCatsOpen] = useState(true)

	useEffect(() => {})

	return (
		<div className="left-filter__category-childs">
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
		</div>
	)
}
