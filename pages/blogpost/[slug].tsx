import Head from 'next/head'
import { useRouter } from 'next/router'
import { MainLayout } from '@/layouts/MainLayout'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { axiosInstance, axiosServerInstance } from '@/store/axiosInstance'
import Link from 'next/link'
import { REACT_APP_IMAGE_URL, serializeObj } from 'config'
import { useEffect, useState } from 'react'
import { setTootipShow, listTooltipShow } from '@/store/slices/globalsSlice'
import ReactTooltip from 'react-tooltip'
import { ModulesByPlace } from '@/components/app/shop/modules/ModulesByPlace'
import { LoadingPlaceholder } from '@/components/app/shop/global/LoadingPlaceholder'
import { BlogSingleArticle } from '@/components/app/blog/BlogSingleArticle'
import { ModuleByCode } from '@/components/app/shop/modules/ModuleByCode'
import { useDispatch, useSelector } from 'react-redux'
import { NextPage } from 'next'
import {
	TBlogArticle,
	TBreadcrumb,
	TModulePage,
	TModulePageResponse,
} from 'types'
import { AppDispatch } from '@/store/store'

export interface TBlogArticleResponse {
	success: number
	breadcrumbs: TBreadcrumb[]
	post: TBlogArticle
}

interface BlogpostProps {
	pageContents: TModulePage | null
	postContents: TBlogArticle | null
	breadcrumbsContent: TBreadcrumb[] | null
	error?: string
}

const Blogpost: NextPage<BlogpostProps> = ({
	pageContents,
	postContents,
	breadcrumbsContent,
	error,
}) => {
	const dispatch = useDispatch<AppDispatch>()
	const router = useRouter()
	const [pageContent, setPageContent] = useState(pageContents)
	const [postContent, setPostContent] = useState(postContents)
	const [breadcrumbs, setBreadcrumbs] = useState(breadcrumbsContent)
	const [pageError, setPageError] = useState(error)

	const tooltipShow = useSelector(listTooltipShow)

	const tooltipOn = () => {
		if (!tooltipShow) {
			dispatch(setTootipShow(true))
		}
	}

	const load = async () => {
		console.log('loading started...')
		const lang = getCookie('lang')
		try {
			const blogResponse = await axiosServerInstance.post<TBlogArticleResponse>(
				'/blog/post?' + serializeObj(router.query),
				serializeObj({ lang })
			)
			console.log('blogResponse.data', blogResponse.data)

			const response = await axiosServerInstance.post<TModulePageResponse>(
				'/module?page=blogpost',
				serializeObj({ lang })
			)
			console.log('response.data', response.data)
			setPageContent(response.data.content)
			setPostContent(blogResponse.data.post)
			setBreadcrumbs(blogResponse.data.breadcrumbs)
		} catch (e: any) {
			setPageError(e.response.data.error)
		}
	}

	useEffect(() => {
		if (!pageContent && !pageError) {
			console.log('loading data...')
			load()
		}
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		tooltipOn()
		ReactTooltip.rebuild()
	})

	if (pageError) {
		return (
			<MainLayout title={'Blog post page'} pageCode={'blog-post'}>
				<div className="container">
					<h1>Error: {pageError}</h1>
				</div>
			</MainLayout>
		)
	}

	if (!postContent) {
		return (
			<MainLayout title={'Blog post page'} pageCode={'blog-post'}>
				<div className="container">
					<LoadingPlaceholder />
				</div>
			</MainLayout>
		)
	}

	return (
		<MainLayout
			title={'Blog page'}
			breadcrumbs={breadcrumbs}
			h1={postContent.name}
			pageCode={'blog-post'}
		>
			<br />
			<BlogSingleArticle article={postContent} />
			{postContent.products.length && (
				<ModuleByCode
					code={'FeaturedProducts'}
					content={{
						products: postContent.products,
						title: 'Сопутствующие товары',
						subtitle: '',
						visible: '4',
						limits: '',
					}}
				/>
			)}
		</MainLayout>
	)
}

Blogpost.getInitialProps = async ({ query, req, res }) => {
	if (!req) {
		return { pageContents: null, postContents: null, breadcrumbsContent: null }
	}

	const lang = getCookie('lang', { req, res })

	try {
		const blogResponse = await axiosServerInstance.post<TBlogArticleResponse>(
			'/blog/post?' + serializeObj(query),
			serializeObj({ lang })
		)
		const pageResponse = await axiosServerInstance.post<TModulePageResponse>(
			'/module?page=blogpost',
			serializeObj({ lang })
		)
		return {
			pageContents: pageResponse.data.content,
			postContents: blogResponse.data.post,
			breadcrumbsContent: blogResponse.data.breadcrumbs,
		}
	} catch (error: any) {
		if (res) res.statusCode = 404
		return {
			pageContents: null,
			postContents: null,
			breadcrumbsContent: null,
			error: error.response.data.error,
		}
	}
}

export default Blogpost
