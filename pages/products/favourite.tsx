import { MainLayout } from '@/layouts/MainLayout'
import { useDispatch, useSelector } from 'react-redux'
import { axiosServerInstance } from '@/store/axiosInstance'
import { serializeObj } from 'config'
import { getCookie } from 'cookies-next'
import { SimpleProductsList } from '@/components/app/shop/catalog/SimpleProductsList'
import { AppDispatch } from '@/store/store'
import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import {
	TBreadcrumb,
	TModulePage,
	TModulePageResponse,
	TPageChangeHandler,
} from 'types'
import {
	listTooltipShow,
	listTranslations,
	setTootipShow,
} from '@/store/slices/globalsSlice'
import {
	listFavourites,
	listFavouritesCount,
	listFavouritesPage,
	setFavouritesPage,
} from '@/store/slices/productsSlice'
import { CompareEmpty } from '@/components/app/shop/catalog/compare/CompareEmpty'

interface FavouriteProps {
	pageContents: TModulePage | null
	error?: string
}

const Favourite: NextPage<FavouriteProps> = ({ pageContents, error = '' }) => {
	const dispatch = useDispatch<AppDispatch>()

	const [pageContent, setPageContent] = useState(pageContents)
	const [pageError, setPageError] = useState(error)

	const translations = useSelector(listTranslations)

	const favourites = useSelector(listFavourites)
	const favouritesCount = useSelector(listFavouritesCount)
	const favouritesPage = useSelector(listFavouritesPage)
	const breadcrumbs: TBreadcrumb[] = [
		{
			title: translations('CatalogFavourites'),
			href: '',
		},
	]

	const tooltipShow = useSelector(listTooltipShow)

	const tooltipOn = () => {
		if (!tooltipShow) {
			dispatch(setTootipShow(true))
		}
	}

	const loadPageContent = async () => {
		const lang = getCookie('lang')
		const looked = getCookie('lookedProducts')
		try {
			const response = await axiosServerInstance.post<TModulePageResponse>(
				'/module?page=favourite',
				serializeObj({ lang, params: JSON.stringify({ looked }) })
			)
			console.log('response.data', response.data)
			setPageContent(response.data.content)
		} catch (e: any) {
			setPageError(e.response.data.error)
		}
	}

	const pageChangeHandler: TPageChangeHandler = (page) => {
		dispatch(setFavouritesPage(page))
	}

	useEffect(() => {
		tooltipOn()

		if (!pageContent && !pageError) {
			loadPageContent()
		}
		// eslint-disable-next-line
	}, [])

	if (pageError) {
		return (
			<MainLayout title="Product page" pageCode="favourite">
				<h1>Error: {pageError}</h1>
			</MainLayout>
		)
	}

	return (
		<MainLayout
			title={translations('CatalogFavourites')}
			page={1}
			totalPages={1}
			path="favourite"
			h1={translations('CatalogFavourites')}
			breadcrumbs={breadcrumbs}
			pageCode="favourite"
		>
			<div id="content" className="catalog-content">
				{favourites.length > 0 && (
					<SimpleProductsList
						products={favourites}
						productsTotal={favouritesCount}
						productsPage={favouritesPage}
						listStatus={'succeeded'}
						isInFavourites={true}
						pageChange={pageChangeHandler}
					/>
				)}
				{!favourites.length && (
					<CompareEmpty
						link="/"
						emptyText={translations('CatalogFavouritesEmpty')}
					/>
				)}
			</div>
		</MainLayout>
	)
}

Favourite.getInitialProps = async ({ query, req, res }) => {
	if (!req) {
		return {
			pageContents: null,
		}
	}

	const lang = getCookie('lang', { req, res })
	const looked = getCookie('lookedProducts', { req, res })

	try {
		const pageResponse = await axiosServerInstance.post<TModulePageResponse>(
			'/module?page=favourite',
			serializeObj({ lang, params: JSON.stringify({ looked }) })
		)

		return {
			serverQuery: query,
			pageContents: pageResponse.data.content,
		}
	} catch (error: any) {
		if (res) res.statusCode = 404
		return {
			serverQuery: query,
			error: error.message,
			pageContents: null,
		}
	}
}

export default Favourite
