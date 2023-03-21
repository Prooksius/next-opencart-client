import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MainLayout } from '@/layouts/MainLayout'
import { axiosInstance, axiosServerInstance } from '@/store/axiosInstance'
import { ProductGallery } from '@/components/app/shop/product/ProductGallery'
import { ProductPageAttrs } from '@/components/app/shop/product/ProductPageAttrs'
import { ProductRelated } from '@/components/app/shop/modules/ProductRelated'
import { ProductRightSide } from '@/components/app/shop/product/ProductRightSide'
import { setTootipShow, listTooltipShow } from '@/store/slices/globalsSlice'
import { useDispatch, useSelector } from 'react-redux'
import {
	getCookie,
	checkCookies,
	setCookies,
	removeCookies,
} from 'cookies-next'
import { LoadingPlaceholder } from '@/components/app/shop/global/LoadingPlaceholder'
import { TProduct } from '@/store/slices/productsSlice'
import { TBreadcrumb } from 'types'
import { NextPage } from 'next'
import { AppDispatch } from '@/store/store'

interface TProductResponse {
	success: number
	breadcrumbs: TBreadcrumb[]
	product: TProduct
}

interface ProductProps {
	serverProduct: TProduct | null
	serverBreadcrumbs: TBreadcrumb[] | null
	error?: string
}

const Product: NextPage<ProductProps> = ({
	serverProduct,
	serverBreadcrumbs,
	error,
}) => {
	const dispatch = useDispatch<AppDispatch>()
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

	const setLooked = (id: number) => {
		let looked: string[] = []
		if (checkCookies('lookedProducts')) {
			const lookedStr = getCookie('lookedProducts')
			looked = JSON.parse(typeof lookedStr === 'string' ? lookedStr : '')
			if (looked.constructor !== Array) {
				looked = []
			}
		}
		if (!looked.find((item) => +item === +id)) {
			removeCookies('lookedProducts')
			looked.push(id.toString())
			if (looked.length > 12) {
				looked.shift()
			}
			const today = new Date()
			setCookies('lookedProducts', JSON.stringify(looked), {
				expires: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 7),
				sameSite: 'lax',
			})
		}
	}

	const load = async () => {
		console.log('loading started...')
		if (router.query.slug) {
			try {
				const response = await axiosInstance.post<TProductResponse>(
					'/product/product?slug=' + router.query.slug
				)
				console.log('response.data', response.data)
				setProduct(response.data.product)
				setBreadcrumbs(response.data.breadcrumbs)
				setLooked(response.data.product.id)
			} catch (e: any) {
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
		if (!product || product.alias !== router.query.slug) {
			load()
		} else if (product.alias === router.query.slug) {
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
			<MainLayout title={'Product page'} pageCode={'product'}>
				<div className="container">
					<h1>Error: {productError}</h1>
				</div>
			</MainLayout>
		)
	}

	if (!product) {
		return (
			<MainLayout title={'Product page'} pageCode={'product'}>
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
			pageContents={null}
			pageCode={'product'}
		>
			<div className="container">
				<div className="product-layout">
					<div className="product-layout__main">
						{product.images.length > 0 && <ProductGallery product={product} />}
					</div>
					<div className="product-layout__right">
						<ProductRightSide product={product} />
					</div>
				</div>
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
		const response = await axiosServerInstance.post<TProductResponse>(
			'/product/product?slug=' + query.slug
		)
		return {
			serverProduct: response.data.product,
			serverBreadcrumbs: response.data.breadcrumbs,
		}
	} catch (error: any) {
		if (res) res.statusCode = 404
		return {
			serverProduct: null,
			serverBreadcrumbs: null,
			error: error.response.data.error,
		}
	}
}

export default Product
