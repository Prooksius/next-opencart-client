import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MainLayout } from '@/layouts/MainLayout'
import { axiosInstance, axiosServerInstance } from '@/store/axiosInstance'
import { ProductGallery } from '@/components/app/shop/ProductGallery'
import { ProductPageAttrs } from '@/components/app/shop/ProductPageAttrs'
import { ProductRelated } from '@/components/app/shop/modules/ProductRelated'
import { setTootipShow, listTooltipShow } from '@/store/slices/globalsSlice'
import { useDispatch, useSelector } from 'react-redux'
import {
	getCookie,
	checkCookies,
	setCookies,
	removeCookies,
} from 'cookies-next'
import { LoadingPlaceholder } from '@/components/app/shop/LoadingPlaceholder'

function Product({ serverProduct, serverBreadcrumbs, error }) {
	const dispatch = useDispatch()
	const [product, setProduct] = useState(serverProduct)
	const [breadcrumbs, setBreadcrumbs] = useState(serverBreadcrumbs)

	const [productError, setProductError] = useState(error)
	const router = useRouter()

	const tooltipShow = useSelector(listTooltipShow)

	const tooltipOn = () => {
		if (!tooltipShow) {
			dispatch(setTootipShow(true))
		}
	}

	const setLooked = (id) => {
		let looked = []
		if (checkCookies('lookedProducts')) {
			const lookedStr = getCookie('lookedProducts')
			looked = JSON.parse(lookedStr)
			if (looked.constructor !== Array) {
				looked = []
			}
		}
		if (!looked.find((item) => +item === +id)) {
			removeCookies('lookedProducts')
			looked.push(id)
			if (looked.length > 12) {
				looked = looked.shift()
			}
			const today = new Date()
			setCookies('lookedProducts', JSON.stringify(looked), {
				expires: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 7),
				sameSite: 'Lax',
			})
		}
	}

	const load = async () => {
		console.log('loading started...')
		if (router.query.slug) {
			try {
				const response = await axiosInstance.post(
					'/product/product?slug=' + router.query.slug
				)
				console.log('response.data', response.data)
				setProduct(response.data.product)
				setBreadcrumbs(response.data.breadcrumbs)
				setLooked(response.data.product.id)
			} catch (e) {
				console.log('e', e)
				setProductError(e.response.data.error)
			}
		}
	}

	useEffect(() => {
		tooltipOn()
	})

	useEffect(() => {
		//		setProduct(null)
		//console.log('product', product)
		if (!product || product.alias === router.query.slug) {
			load()
		} else if (product || product.alias === router.query.slug) {
			setLooked(product.id)
		}
		// eslint-disable-next-line
	}, [router.query.slug])

	useEffect(() => {
		if (!serverProduct && !productError) {
			console.log('loading data...')
			//load()
		}

		tooltipOn()

		//console.log('useEffect')
		// eslint-disable-next-line
	}, [])

	if (productError) {
		return (
			<MainLayout title={'Product page'}>
				<div className="container">
					<h1>Error: {productError}</h1>
				</div>
			</MainLayout>
		)
	}

	if (!product) {
		return (
			<MainLayout title={'Product page'}>
				<div className="container">
					<LoadingPlaceholder />
				</div>
			</MainLayout>
		)
	}

	return (
		<MainLayout
			title={'Product page'}
			breadcrumbs={breadcrumbs}
			h1={product.name}
		>
			<div className="container">
				<ProductGallery product={product} setProduct={setProduct} />
				<div className="prodiuct-description_cont">
					<h2>Описание</h2>
					<div
						className="prodiuct-description"
						dangerouslySetInnerHTML={{
							__html: product.description,
						}}
					></div>
				</div>
				<div className="prodiuct-attributes_cont">
					{product.attributes.length > 0 && (
						<>
							<h2>Параметры</h2>
							<ProductPageAttrs
								attributes={product.attributes}
								productId={product.id}
							/>
						</>
					)}
				</div>
				<div className="prodiuct-related_cont">
					{product.related.length > 0 && (
						<>
							<h2>Сопутствующие товары</h2>
							<ProductRelated relateds={product.related} />
						</>
					)}
				</div>
			</div>
		</MainLayout>
	)
}

// This gets called on every request
/*
export async function getServerSideProps({ query }) {
	try {
		console.log('Product fetching... ')
		const response = await axiosInstance.post('/product?slug=' + query.slug)

		return { props: { serverProduct: response.data.product } }
	} catch (error) {
		return { props: { serverProduct: null } }
	}
}
*/

Product.getInitialProps = async ({ query, req, res }) => {
	if (!req) {
		console.log('Client request...')
		return { serverProduct: null, serverBreadcrumbs: null }
	}
	try {
		console.log('Product fetching... query = ', query)
		const response = await axiosServerInstance.post(
			'/product/product?slug=' + query.slug
		)
		return {
			serverProduct: response.data.product,
			serverBreadcrumbs: response.data.breadcrumbs,
		}
	} catch (error) {
		res.statusCode = 404
		return {
			serverProduct: null,
			serverBreadcrumbs: null,
			error: error.response.data.error,
		}
	}
}

export default Product
