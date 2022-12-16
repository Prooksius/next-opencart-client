import Head from 'next/head'
import { useRouter } from 'next/router'
import { MainLayout } from '@/layouts/MainLayout'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { axiosInstance, axiosServerInstance } from '@/store/axiosInstance'
import Link from 'next/link'
import { serializeObj } from 'config'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ModulesByPlace } from '@/components/app/shop/modules/ModulesByPlace'
import { listTranslations } from '@/store/slices/globalsSlice'

function About({ pageContents, error }) {
	const [pageContent, setPageContent] = useState(pageContents)
  const [pageError, setPageError] = useState(error)
  
  const translations = useSelector(listTranslations)

	const load = async () => {
		console.log('loading started...')
		const lang = getCookie('lang')
		try {
			const response = await axiosServerInstance.post(
				'/module?page=about',
				serializeObj({ lang })
			)
			console.log('response.data', response.data)
			setPageContent(response.data.content)
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
	/*
	if (!pageContent) {
		return (
			<MainLayout title={'About page'}>
				<div className="container">
					<LoadingPlaceholder />
				</div>
			</MainLayout>
		)
	}
  */
	return (
		<MainLayout
			title={'About page'}
			breadcrumbs={[{ href: '', title: translations('About') }]}
			h1={translations('About')}
		>
			<div className="container">
				<ModulesByPlace
					pageCode="about"
					position={'page-top'}
					content={pageContent ? pageContent['page-top'] : null}
				/>
				<ModulesByPlace
					pageCode="about"
					position={'content-top'}
					content={pageContent ? pageContent['content-top'] : null}
				/>
				<i>
					<br />
					Здесь будет (или не будет) сам контент страницы О нас
					<br />
					<br />
				</i>
				<ModulesByPlace
					pageCode="about"
					position={'content-bottom'}
					content={pageContent ? pageContent['content-bottom'] : null}
				/>
				<ModulesByPlace
					pageCode="about"
					position={'page-bottom'}
					content={pageContent ? pageContent['page-bottom'] : null}
				/>
			</div>
		</MainLayout>
	)
}

About.getInitialProps = async ({ query, req, res }) => {
	if (!req) {
		return { pageContents: null }
	}

	const lang = getCookie('lang', { req, res })

	try {
		const pageResponse = await axiosServerInstance.post(
			'/module?page=about',
			serializeObj({ lang })
		)
		return {
			pageContents: pageResponse.data.content,
		}
	} catch (error) {
		res.statusCode = 404
		return {
			pageContents: null,
			error: error.message,
		}
	}
}

export default About
