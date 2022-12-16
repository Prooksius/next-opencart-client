import { MainLayout } from '@/layouts/MainLayout'
import { useDispatch, useSelector } from 'react-redux'
import { axiosServerInstance } from '@/store/axiosInstance'
import { REACT_APP_IMAGE_URL, PRODUCTS_LIMIT, serializeObj } from '/config'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import {
	setRootCats,
	fetchRootCats,
	clearRootCats,
} from '@/store/slices/categoriesSlice'
import { CategoryTiles } from '@/components/app/shop/CategoryTiles'
import { useEffect } from 'react'

function Catalog({ roots }) {
	const dispatch = useDispatch()
	const router = useRouter()

//	if (roots) {
		console.log('settng roots', roots)
		dispatch(setRootCats(roots))
//	}
/*
	useEffect(() => {
		const load = async () => {
			dispatch(fetchRootCats())
		}
		if (!roots) {
			load()
		}
		//		return clear
		// eslint-disable-next-line
	}, [])
*/
	return (
		<MainLayout title={'Catalog page'} path="catalog">
			<div className="container">
				<CategoryTiles />
			</div>
		</MainLayout>
	)
}

export async function getServerSideProps({ query, req, res }) {
	const lang = getCookie('lang', { req, res })
	console.log('lang', lang)

	const response = await axiosServerInstance.post(
		'/category/roots',
		serializeObj({ lang })
	)
	console.log('response.data', response.data)

	return {
		props: { roots: response.data.roots },
	}
}

export default Catalog
