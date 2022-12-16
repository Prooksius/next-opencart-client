import { MainLayout } from '@/layouts/MainLayout'
import { useDispatch, useSelector } from 'react-redux'
import { axiosServerInstance } from '@/store/axiosInstance'
import { REACT_APP_IMAGE_URL, PRODUCTS_LIMIT, serializeObj } from 'config'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { ProductsList } from '@/components/app/shop/ProductsList'
import { CategoriesVertMenu } from '@/components/app/shop/CategoriesVertMenu'

import {
	listProductsItemsCount,
	setProducts,
} from '@/store/slices/productsSlice'
import {
	setCategories,
} from '@/store/slices/categoriesSlice'

function Products({ products, catalog, serverPage }) {
  const dispatch = useDispatch()

	if (products) {
		dispatch(setProducts(products))
	}

	if (catalog) {
		dispatch(setCategories(catalog.categories))
	}

	const itemsCount = useSelector(listProductsItemsCount)

	const totalPages = Math.ceil(itemsCount / PRODUCTS_LIMIT)

	return (
		<MainLayout
			title={'Product page'}
			page={serverPage}
			totalPages={totalPages}
			path="product"
		>
      <div className="container">
        <CategoriesVertMenu />
				<ProductsList />
			</div>
		</MainLayout>
	)
}

Products.getInitialProps = async ({ query, req, res }) => {
	if (!req) {
		return { products: null, serverPage: query.page || 1 }
	}

	const lang = getCookie('lang', { req, res })

	const productsResponse = await axiosServerInstance.post(
		'/product/page?page=' + (query.page || 1) + '&pagesize=' + PRODUCTS_LIMIT,
		serializeObj({ lang })
	)
	console.log('response.data', productsResponse.data)

	const catalogResponse = await axiosServerInstance.post(
		'/category?slug=' + (query.slug ? query.slug : ''),
		serializeObj({ lang })
	)
	console.log('response.data', catalogResponse.data)

	return {
		products: productsResponse.data.products,
		catalog: catalogResponse.data.catalog,
		serverPage: query.page || 1,
	}
}

export default Products
