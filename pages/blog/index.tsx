import Head from 'next/head'
import { useRouter } from 'next/router'
import { MainLayout } from '@/layouts/MainLayout'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { axiosInstance, axiosServerInstance } from '@/store/axiosInstance'
import Link from 'next/link'
import { REACT_APP_IMAGE_URL, serializeObj } from 'config'
import { useEffect, useState } from 'react'
import { listTranslations } from '@/store/slices/globalsSlice'
import { ModulesByPlace } from '@/components/app/shop/modules/ModulesByPlace'
import { LoadingPlaceholder } from '@/components/app/shop/global/LoadingPlaceholder'
import { BlogCategoryList } from '@/components/app/blog/BlogCategoryList'
import { BlogArticleList } from '@/components/app/blog/BlogArticleList'
import { useSelector } from 'react-redux'
import {
	TBlogArticles,
	TBlogCategory,
	TBreadcrumb,
	TModulePage,
	TModulePageResponse,
} from 'types'
import { NextPage } from 'next'

interface TBlogRoots {
	categories: {
		current: null
		childs: TBlogCategory[]
	}
}

export interface TBlogResponse {
	success: number
	breadcrumbs: TBreadcrumb[]
	blog: TBlogRoots
	articles: TBlogArticles
}

interface BlogProps {
	pageContents: TModulePage | null
	blogContents: TBlogRoots | null
	articleContents: TBlogArticles | null
	breadcrumbsContent: TBreadcrumb[] | null
	error?: string
}

const Blog: NextPage<BlogProps> = ({
	pageContents,
	blogContents,
	articleContents,
	breadcrumbsContent,
	error,
}) => {
	const translations = useSelector(listTranslations)
	const [pageContent, setPageContent] = useState(pageContents)
	const [blogContent, setBlogContent] = useState(blogContents)
	const [articleContent, setArticleContent] = useState(articleContents)
	const [breadcrumbs, setBreadcrumbs] = useState(breadcrumbsContent)

	const [pageError, setPageError] = useState(error)

	const load = async () => {
		console.log('loading started...')
		const lang = getCookie('lang')
		try {
			const blogResponse = await axiosServerInstance.post<TBlogResponse>(
				'/blog',
				serializeObj({ lang })
			)
			console.log('blogResponse.data', blogResponse.data)

			const response = await axiosServerInstance.post<TModulePageResponse>(
				'/module?page=blog',
				serializeObj({ lang })
			)
			console.log('response.data', response.data)
			setPageContent(response.data.content)
			setBlogContent(blogResponse.data.blog)
			setArticleContent(blogResponse.data.articles)
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

	if (pageError) {
		return (
			<MainLayout title={'Blog page'} pageCode={'blog'}>
				<div className="container">
					<h1>Error: {pageError}</h1>
				</div>
			</MainLayout>
		)
	}

	if (!blogContent || !articleContent) {
		return (
			<MainLayout title={'Blog page'} pageCode={'blog'}>
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
			h1={translations('Blog')}
			pageContents={pageContent}
			pageCode={'blog'}
		>
			<br />
			<h2>Категории блога</h2>
			<BlogCategoryList categories={blogContent.categories.childs} />
			<br />
			<h2>Избранные статьи</h2>
			<BlogArticleList articles={articleContent.list} />
		</MainLayout>
	)
}

Blog.getInitialProps = async ({ query, req, res }) => {
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
			'/blog',
			serializeObj({ lang })
		)
		const pageResponse = await axiosServerInstance.post<TModulePageResponse>(
			'/module?page=blog',
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
			error: error.message,
		}
	}
}

export default Blog
