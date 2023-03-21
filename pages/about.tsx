import { MainLayout } from '@/layouts/MainLayout'
import { getCookie } from 'cookies-next'
import { axiosInstance, axiosServerInstance } from '@/store/axiosInstance'
import { serializeObj } from 'config'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { listTranslations } from '@/store/slices/globalsSlice'
import { NextPage } from 'next'
import { TModulePage, TModulePageResponse } from 'types'

interface AboutProps {
	pageContents: TModulePage | null
	error?: string
}

const About: NextPage<AboutProps> = ({ pageContents, error }) => {
	const [pageContent, setPageContent] = useState(pageContents)
	const [pageError, setPageError] = useState(error)

	const translations = useSelector(listTranslations)

	const load = async () => {
		console.log('loading started...')
		const lang = getCookie('lang')
		try {
			const response = await axiosInstance.post<TModulePageResponse>(
				'/module?page=about',
				serializeObj({ lang })
			)
			console.log('response.data', response.data)
			setPageContent(response.data.content)
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
			<MainLayout title="About page" pageCode="about">
				<div className="container">
					<h1>Error: {pageError}</h1>
				</div>
			</MainLayout>
		)
	}

	return (
		<MainLayout
			title={'About page'}
			breadcrumbs={[{ href: '', title: translations('About') }]}
			h1={translations('About')}
			pageContents={pageContent}
			pageCode="about"
		>
			<i>
				<br />
				Здесь будет (или не будет) сам контент страницы О нас
				<br />
				<br />
			</i>
		</MainLayout>
	)
}

About.getInitialProps = async ({ query, req, res }) => {
	if (!req) {
		return { pageContents: null }
	}

	const lang = getCookie('lang', { req, res })

	try {
		const pageResponse = await axiosServerInstance.post<TModulePageResponse>(
			'/module?page=about',
			serializeObj({ lang })
		)
		return {
			pageContents: pageResponse.data.content,
		}
	} catch (error: any) {
		if (res) res.statusCode = 404
		return {
			pageContents: null,
			error: error.message,
		}
	}
}

export default About
