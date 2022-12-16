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
import { LoadingPlaceholder } from '@/components/app/shop/LoadingPlaceholder'
import { BlogCategoryList } from '@/components/app/blog/BlogCategoryList'
import { BlogArticleList } from '@/components/app/blog/BlogArticleList'
import { useSelector } from 'react-redux'

function Blog({
	pageContents,
	blogContents,
	articleContents,
	breadcrumbsContent,
	error,
}) {
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
			const blogResponse = await axiosServerInstance.post(
				'/blog',
				serializeObj({ lang })
			)
			console.log('blogResponse.data', blogResponse.data)

			const response = await axiosServerInstance.post(
				'/module?page=blog',
				serializeObj({ lang })
			)
			console.log('response.data', response.data)
			setPageContent(response.data.content)
			setBlogContent(blogResponse.data.blog)
			setArticleContent(blogResponse.data.articles)
			setBreadcrumbs(blogResponse.data.breadcrumbs)
		} catch (e) {
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
			<MainLayout title={'About page'}>
				<div className="container">
					<h1>Error: {pageError}</h1>
				</div>
			</MainLayout>
		)
	}

	if (!pageContent) {
		return (
			<MainLayout title={'About page'}>
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
		>
			<div className="container">
				<ModulesByPlace
					pageCode="blog"
					position={'page-top'}
					content={pageContent['page-top']}
				/>
				<ModulesByPlace
					pageCode="blog"
					position={'content-top'}
					content={pageContent['content-top']}
				/>
				<br />
				<h2>Категории блога</h2>
				<BlogCategoryList categories={blogContent.categories.childs} />
				<br />
				<h2>Избранные статьи</h2>
				<BlogArticleList articles={articleContent.list} />
				<ModulesByPlace
					pageCode="blog"
					position={'content-bottom'}
					content={pageContent['content-bottom']}
				/>
				<ModulesByPlace
					pageCode="blog"
					position={'page-bottom'}
					content={pageContent['page-bottom']}
				/>
			</div>
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
		const blogResponse = await axiosServerInstance.post(
			'/blog',
			serializeObj({ lang })
		)
		const pageResponse = await axiosServerInstance.post(
			'/module?page=blog',
			serializeObj({ lang })
		)
		return {
			pageContents: pageResponse.data.content,
			blogContents: blogResponse.data.blog,
			articleContents: blogResponse.data.articles,
			breadcrumbsContent: blogResponse.data.breadcrumbs,
		}
	} catch (error) {
		res.statusCode = 404
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
