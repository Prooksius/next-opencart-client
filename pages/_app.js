import 'react-toastify/dist/ReactToastify.css'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import '@/styles/globals.css'
import App from 'next/app'
import { PageTransition } from 'next-page-transitions'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { axiosServerInstance } from '@/store/axiosInstance'
import loadReCaptcha from '@/components/app/forms/recaptcha/loadReCaptcha'
import { GlobalsWrapper } from '@/components/app/GlobalsWrapper'
import { serializeObj } from 'config'
import { getCookie, setCookies, checkCookies, getCookies } from 'cookies-next'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'
import { wrapper } from '@/store/store'
import { setGlobals } from '@/store/slices/globalsSlice'
import { setCart } from '@/store/slices/cartSlice'
import { setProducts, setProductViewType } from '@/store/slices/productsSlice'
import {
	setCategories,
	setBreadcrumbs as setCatBreadcrumbs,
} from '@/store/slices/categoriesSlice'

const TIMEOUT = 400

function MyApp({ Component, pageProps }) {
	const router = useRouter()

	useEffect(() => {
		if (!checkCookies('lang')) {
			const today = new Date()
			setCookies('lang', 'ru-RU', {
				expires: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 7),
				sameSite: 'Lax',
			})
		}

		if (!checkCookies('session_id')) {
			const today = new Date()
			const session_id = uuidv4()
			setCookies('session_id', session_id, {
				expires: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 30),
				sameSite: 'Lax',
			})
		}

		//loadReCaptcha('6Ld8b-kaAAAAAKKyKxG3w3RW0hCxqBelwko_jTFZ')
		// eslint-disable-next-line
	}, [])

	return (
		<GlobalsWrapper>
			<PageTransition timeout={300} classNames="page-transition">
				<Component {...pageProps} key={router.asPath.split('?')[0]} />
			</PageTransition>
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

      const customer = customer_data ? JSON.parse(customer_data) : {}
      const address = address_data ? JSON.parse(address_data) : {}

      const response = await axiosServerInstance.post(
        '/settings',
        qs.stringify(
          {
            lang,
            session_id,
            customer,
            address,
            delivery: delivery ? delivery : '',
            payment: payment ? payment : '',
          },
          { encodeValuesOnly: true }
        )
      )

      //console.log('response', response)

      store.dispatch(setGlobals(response.data))
      store.dispatch(setCart(response.data))
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
