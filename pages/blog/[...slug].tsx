import Head from 'next/head'
import { useRouter } from 'next/router'
import { MainLayout } from '@/layouts/MainLayout'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { axiosInstance, axiosServerInstance } from '@/store/axiosInstance'
import Link from 'next/link'
import { REACT_APP_IMAGE_URL, serializeObj } from 'config'
import { useEffect, useState } from 'react'
import { listTranslations } from '@/store/slices/globalsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { ModulesByPlace } from '@/components/app/shop/modules/ModulesByPlace'
import { LoadingPlaceholder } from '@/components/app/shop/global/LoadingPlaceholder'
import { BlogCategoryList } from '@/components/app/blog/BlogCategoryList'
import { BlogArticleList } from '@/components/app/blog/BlogArticleList'
import { BlogCurrentCategory } from '@/components/app/blog/BlogCurrentCategory'
import { BlogArticlePageList } from '@/components/app/blog/BlogArticlePageList'
import {
	clearFilterChanged,
	isFiltersChanged,
	getFilterPath,
	setPage,
	listStatus,
	setStatus,
} from '@/store/slices/blogSlice'
import {
	TBlogArticles,
	TBlogCategory,
	TBreadcrumb,
	TModulePage,
	TModulePageResponse,
} from 'types'
import { NextPage } from 'next'
import { AppDispatch } from '@/store/store'

export interface TBlogResponse {
	success: number
	breadcrumbs: TBreadcrumb[]
	blog: TBlogCategories
	articles: TBlogArticles
}

interface TBlogCategories {
	categories: {
		current: TBlogCategory
		childs: TBlogCategory[]
	}
}
interface BlogCategoryProps {
	pageContents: TModulePage | null
	blogContents: TBlogCategories | null
	articleContents: TBlogArticles | null
	breadcrumbsContent: TBreadcrumb[] | null
	error?: string
}

const BlogCategory: NextPage<BlogCategoryProps> = ({
	pageContents,
	blogContents,
	articleContents,
	breadcrumbsContent,
	error,
}) => {
	const router = useRouter()
	const dispatch = useDispatch<AppDispatch>()
	const translations = useSelector(listTranslations)

	const [pageContent, setPageContent] = useState(pageContents)
	const [blogContent, setBlogContent] = useState(blogContents)
	const [articleContent, setArticleContent] = useState(articleContents)
	const [breadcrumbs, setBreadcrumbs] = useState(breadcrumbsContent)
	const [pageError, setPageError] = useState(error)

	const status = useSelector(listStatus)

	const filterChanged = useSelector(isFiltersChanged)
	const filterPath = useSelector(getFilterPath)

	const pageChange = (page: number) => {
		dispatch(setPage(page))
	}

	const load = async () => {
		console.log('loading started...')
		const lang = getCookie('lang')
		try {
			dispatch(setStatus('loading'))
			const blogResponse = await axiosServerInstance.post<TBlogResponse>(
				'/blog?' + serializeObj(filterPath()),
				serializeObj({ lang })
			)
			console.log('blogResponse.data.articles', blogResponse.data.articles)

			const response = await axiosServerInstance.post<TModulePageResponse>(
				'/module?page=blog-category',
				serializeObj({ lang })
			)
			setPageContent(response.data.content)
			setBlogContent(blogResponse.data.blog)
			setArticleContent(blogResponse.data.articles)
			setBreadcrumbs(blogResponse.data.breadcrumbs)
			dispatch(setStatus('succeeded'))
		} catch (e: any) {
			setPageError(e.response.data.error)
		}
	}

	useEffect(() => {
		console.log('first time render')
		if (!blogContent && !pageError) {
			console.log('loading data...')
			load()
		}
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (filterChanged) {
			dispatch(clearFilterChanged())
			const filter = filterPath()
			//			dispatch(setRequestQuery(router.query))
			console.log('loading articles...filtersChanged', filter)
			if (blogContent) {
				load()
			}
		}
		// eslint-disable-next-line
	}, [filterChanged])

	if (pageError) {
		return (
			<MainLayout title={'Blog category page'} pageCode={'blog-category'}>
				<div className="container">
					<h1>Error: {pageError}</h1>
				</div>
			</MainLayout>
		)
	}

	if (!blogContent || !articleContent) {
		return (
			<MainLayout title={'Blog category page'} pageCode={'blog-category'}>
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
			h1={blogContent.categories.current.name}
			pageContents={pageContent}
			pageCode={'blog-category'}
		>
			<BlogCurrentCategory category={blogContent.categories.current} />
			<br />
			<h2>Подкатегории</h2>
			<BlogCategoryList categories={blogContent.categories.childs} />
			<br />
			<h2>Статьи</h2>
			<BlogArticlePageList
				articles={articleContent}
				status={status}
				pageChangeHandler={pageChange}
			/>
		</MainLayout>
	)
}

BlogCategory.getInitialProps = async ({ query, req, res }) => {
	if (!req) {
		return {
			pageContents: null,
			blogContents: null,
			articleContents: null,
			breadcrumbsContent: null,
		}
	}

	const lang = getCookie('lang', { req, res })

	try {
		const blogResponse = await axiosServerInstance.post<TBlogResponse>(
			'/blog?' + serializeObj(query),
			serializeObj({ lang })
		)
		const pageResponse = await axiosServerInstance.post<TModulePageResponse>(
			'/module?page=blog-category',
			serializeObj({ lang })
		)
		return {
			pageContents: pageResponse.data.content,
			blogContents: blogResponse.data.blog,
			articleContents: blogResponse.data.articles,
			breadcrumbsContent: blogResponse.data.breadcrumbs,
		}
	} catch (error: any) {
		if (res) res.statusCode = 404
		return {
			pageContents: null,
			blogContents: null,
			articleContents: null,
			breadcrumbsContent: null,
			error: error.response.data.error,
		}
	}
}

export default BlogCategory
