import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MainLayout } from '@/layouts/MainLayout'
import { axiosServerInstance } from '@/store/axiosInstance'
import { serializeObj } from 'config'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ReactTooltip from 'react-tooltip'
import { LoadingPlaceholder } from '@/components/app/shop/LoadingPlaceholder'
import { ModulesByPlace } from '@/components/app/shop/modules/ModulesByPlace'
import { setTootipShow, listTooltipShow } from '@/store/slices/globalsSlice'

if (typeof window !== `undefined`) {
	gsap.registerPlugin(ScrollTrigger)
	gsap.core.globals('ScrollTrigger', ScrollTrigger)
}

function Home({ pageContents, error }) {
	const dispatch = useDispatch()
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
			const response = await axiosServerInstance.post(
				'/module?page=',
				serializeObj({ lang, params: JSON.stringify({ looked }) })
			)
			console.log('response.data', response.data)
			setPageContent(response.data.content)
		} catch (e) {
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
			<MainLayout title={'Home page'}>
				<div className="container">
					<h1>Error: {pageError}</h1>
				</div>
			</MainLayout>
		)
	}

	/*
	if (!pageContent) {
		return (
			<MainLayout title={'Home page'}>
				<div className="container">
					<LoadingPlaceholder />
				</div>
			</MainLayout>
		)
	}
  */

	return (
		<MainLayout title={'Home Page'}>
			<div className="container">
				<ModulesByPlace
					pageCode=""
					position={'page-top'}
					content={pageContent ? pageContent['page-top'] : null}
				/>
				<ModulesByPlace
					pageCode=""
					position={'content-top'}
					content={pageContent ? pageContent['content-top'] : null}
				/>
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
				<ModulesByPlace
					pageCode=""
					position={'content-bottom'}
					content={pageContent ? pageContent['content-bottom'] : null}
				/>
				<ModulesByPlace
					pageCode=""
					position={'page-bottom'}
					content={pageContent ? pageContent['page-bottom'] : null}
				/>
			</div>
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
		const pageResponse = await axiosServerInstance.post(
			'/module?page=',
			serializeObj({ lang, params: JSON.stringify({ looked }) })
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

export default Home
