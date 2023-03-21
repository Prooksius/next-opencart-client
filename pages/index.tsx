import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MainLayout } from '@/layouts/MainLayout'
import { axiosInstance, axiosServerInstance } from '@/store/axiosInstance'
import { serializeObj } from 'config'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ReactTooltip from 'react-tooltip'
import { LoadingPlaceholder } from '@/components/app/shop/global/LoadingPlaceholder'
import { ModulesByPlace } from '@/components/app/shop/modules/ModulesByPlace'
import { setTootipShow, listTooltipShow } from '@/store/slices/globalsSlice'
import { NextPage } from 'next'
import { TModulePage, TModulePageResponse } from 'types'
import { AppDispatch } from '@/store/store'

if (typeof window !== `undefined`) {
	gsap.registerPlugin(ScrollTrigger)
}
interface HomeProps {
	pageContents: TModulePage | null
	error?: string
}

const Home: NextPage<HomeProps> = ({ pageContents, error }) => {
	const dispatch = useDispatch<AppDispatch>()
	const [pageContent, setPageContent] = useState(pageContents)
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
		const looked = getCookie('lookedProducts')
		try {
			const response = await axiosInstance.post<TModulePageResponse>(
				'/module?page=',
				serializeObj({ lang, params: JSON.stringify({ looked }) })
			)
			console.log('response.data', response.data)
			setPageContent(response.data.content)
		} catch (e: any) {
			setPageError(e.response.data.message)
		}
	}

	const setGsap = () => {
		gsap.from('#box', {
			opacity: 0,
			translateY: '100px',
			ease: 'power.inOut',
			scrollTrigger: {
				trigger: '#box',
				start: 'top bottom',
				end: 'top center',
				scrub: 1,
			},
		})
		gsap.to('#box', {
			width: '100%',
			ease: 'power.inOut',
			scrollTrigger: {
				trigger: '#box',
				start: 'top center+=300px',
				end: 'top top+=200px',
				scrub: 1,
			},
		})
	}

	useEffect(() => {
		tooltipOn()
		ReactTooltip.rebuild()
	})

	useEffect(() => {
		if (pageContent) {
			setTimeout(() => {
				setGsap()
			}, 100)
		}
		// eslint-disable-next-line
	}, [pageContent])

	useEffect(() => {
		if (!pageContent && !pageError) {
			console.log('loading data...')
			load()
		}
		tooltipOn()
		// eslint-disable-next-line
	}, [])

	if (pageError) {
		return (
			<MainLayout title="Home page" pageCode="">
				<div className="container">
					<h1>Error: {pageError}</h1>
				</div>
			</MainLayout>
		)
	}

	return (
		<MainLayout title="Home Page" pageContents={pageContent} pageCode="">
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<div className="box" id="box">
				Box
			</div>
			<br />
			<br />
			<br />
			<br />
		</MainLayout>
	)
}

Home.getInitialProps = async ({ query, req, res }) => {
	if (!req) {
		return { pageContents: null }
	}

	const lang = getCookie('lang', { req, res })
	const looked = getCookie('lookedProducts', { req, res })

	try {
		const pageResponse = await axiosServerInstance.post<TModulePageResponse>(
			'/module?page=',
			serializeObj({ lang, params: JSON.stringify({ looked }) })
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

export default Home
