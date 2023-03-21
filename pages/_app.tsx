import '@/styles/normalize.css'
import 'react-toastify/dist/ReactToastify.css'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import '@/styles/globals.css'
import App from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { axiosServerInstance } from '@/store/axiosInstance'
import loadReCaptcha from '@/components/app/forms/recaptcha/loadReCaptcha'
import { GlobalsWrapper } from '@/components/app/shop/global/GlobalsWrapper'
import { serializeObj } from 'config'
import { getCookie, setCookies, checkCookies, getCookies } from 'cookies-next'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'
import { wrapper } from '@/store/store'
import { setGlobals } from '@/store/slices/globalsSlice'
import { setCart } from '@/store/slices/cartSlice'
import { TSettingsResponse } from 'types'
import { setCompares, setFavourites } from '@/store/slices/productsSlice'

const TIMEOUT = 400

interface MyAppProps {
	Component: any
	pageProps: any
}

const MyApp = ({ Component, pageProps }: MyAppProps) => {
	const router = useRouter()

	useEffect(() => {
		if (!checkCookies('lang')) {
			const today = new Date()
			setCookies('lang', 'ru-RU', {
				expires: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 7),
				sameSite: 'lax',
			})
		}

		if (!checkCookies('session_id')) {
			const today = new Date()
			const session_id = uuidv4()
			setCookies('session_id', session_id, {
				expires: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 30),
				sameSite: 'lax',
			})
		}

		//loadReCaptcha('6Ld8b-kaAAAAAKKyKxG3w3RW0hCxqBelwko_jTFZ')
		// eslint-disable-next-line
	}, [])

	return (
		<GlobalsWrapper>
			<Component {...pageProps} />
		</GlobalsWrapper>
	)
}

MyApp.getInitialProps = wrapper.getInitialAppProps(
	(store) => async (appContext) => {
		if (appContext.ctx.req) {
			const lang = getCookie('lang', {
				req: appContext.ctx.req,
				res: appContext.ctx.res,
			})

			const session_id = getCookie('session_id', {
				req: appContext.ctx.req,
				res: appContext.ctx.res,
			})

			const delivery = getCookie('delivery', {
				req: appContext.ctx.req,
				res: appContext.ctx.res,
			})

			const payment = getCookie('payment', {
				req: appContext.ctx.req,
				res: appContext.ctx.res,
			})

			const customer_data = getCookie('customer', {
				req: appContext.ctx.req,
				res: appContext.ctx.res,
			})

			const address_data = getCookie('address', {
				req: appContext.ctx.req,
				res: appContext.ctx.res,
			})

			const favourites = getCookie('favouriteProducts', {
				req: appContext.ctx.req,
				res: appContext.ctx.res,
			})

			console.log('favourites', favourites)

			const compares = getCookie('compareProducts', {
				req: appContext.ctx.req,
				res: appContext.ctx.res,
			})

			const customer =
				typeof customer_data === 'string' ? JSON.parse(customer_data) : {}
			const address =
				typeof address_data === 'string' ? JSON.parse(address_data) : {}

			const response = await axiosServerInstance.post<TSettingsResponse>(
				'/settings',
				qs.stringify(
					{
						lang,
						session_id,
						customer,
						address,
						favourites: favourites ? favourites : [],
						compares: compares ? compares : [],
						delivery: delivery ? delivery : '',
						payment: payment ? payment : '',
					},
					{ encodeValuesOnly: true }
				)
			)

			store.dispatch(setGlobals(response.data.globals))
			store.dispatch(setFavourites(response.data.globals.favourites))
			store.dispatch(setCompares(response.data.globals.compares))
			store.dispatch(setCart(response.data.cart))
		}

		// calls page's `getInitialProps` and fills `appProps.pageProps`
		const appProps = await App.getInitialProps(appContext)
		console.log('appProps: ', appProps)

		if (!appContext.ctx.req) {
			return { ...appProps }
		}

		return {
			pageProps: {
				...appProps.pageProps,
			},
		}
	}
)

export default wrapper.withRedux(MyApp)
