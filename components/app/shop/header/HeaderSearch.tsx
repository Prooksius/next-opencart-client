import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { listTranslations, listCurrency } from '@/store/slices/globalsSlice'
import {
	lookupProducts,
	clearHeaderSearch,
	ListHeaderSearchList,
	ListHeaderSearchStatus,
} from '@/store/slices/productsSlice'
import Image from 'next/image'
import { REACT_APP_IMAGE_URL } from 'config'
import debounce from 'lodash.debounce'
import { Loader } from '@/components/app/shop/global/Loader'
import classNames from 'classnames'
import { AppDispatch } from '@/store/store'

export const HeaderSearch = () => {
	const ref = useRef<HTMLDivElement | null>(null)
	const dispatch = useDispatch<AppDispatch>()
	const translations = useSelector(listTranslations)

	const headerSearchList = useSelector(ListHeaderSearchList)
	const headerSearchStatus = useSelector(ListHeaderSearchStatus)

	const [search, setSearch] = useState('')

	const doSearch = () => {
		if (search.length < 3) {
			dispatch(clearHeaderSearch())
		} else {
			dispatch(
				lookupProducts({
					query: { search, page: '1', limit: '12' },
				})
			)
		}
	}

	// eslint-disable-next-line
	const debouncedSave = useCallback(
		debounce(() => doSearch(), 300),
		[search]
	)

	useEffect(() => {
		debouncedSave()
		return debouncedSave.cancel
	}, [search, debouncedSave])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				dispatch(clearHeaderSearch())
			}
		}
		document.addEventListener('click', handleClickOutside, true)
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
		// eslint-disable-next-line
	}, [])

	return (
		<div ref={ref} className="header-content__product-lookup">
			<div className="product-lookup__search-furm">
				<input
					type="text"
					value={search}
					onFocus={doSearch}
					onChange={(event) => setSearch(event.target.value)}
					placeholder={translations('HeaderSearch')}
				/>
				{headerSearchStatus === 'loading' && <Loader />}
			</div>
			{headerSearchStatus !== 'idle' && (
				<div className="product-lookup__search-results">
					{headerSearchList.length > 0 &&
						headerSearchList.map((item) => (
							<Link href={'/product/' + item.alias} key={item.id}>
								<a className="product-lookup__found-item">
									<span className="thumb">
										<Image
											src={REACT_APP_IMAGE_URL + item.thumb}
											alt={item.name}
											width="32px"
											height="32px"
										/>
									</span>
									<span className="name">{item.name}</span>
									<span className="product-prices">
										{item.special > 0 && (
											<span
												className="product-price product-price__new"
												dangerouslySetInnerHTML={{
													__html: item.special_str,
												}}
											></span>
										)}
										<span
											className={classNames('product-price', {
												'product-price__old': item.special > 0,
											})}
											dangerouslySetInnerHTML={{
												__html: item.price_str,
											}}
										></span>
									</span>
								</a>
							</Link>
						))}
					{headerSearchStatus === 'succeeded' &&
						headerSearchList.length === 0 && (
							<span className="product-lookup__found-item">
								{translations('HeaderSearchNothingFound')}
							</span>
						)}
					{headerSearchStatus === 'failed' && (
						<div className="product-lookup__error">
							{translations('HeaderSearchLookupError')}
						</div>
					)}
				</div>
			)}
		</div>
	)
}
