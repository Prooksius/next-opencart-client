import { HeadBlock } from './HeadBlock'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { REACT_APP_IMAGE_URL } from 'config'
import {
	getCookie,
	setCookies,
	checkCookies,
	removeCookies,
} from 'cookies-next'

import {
	listSettings,
	listSettingsStatus,
	listLangSettings,
	listLanguages,
	listTranslations,
	listUser,
	fetchGlobals,
	setGlobals,
	clearGlobals,
} from '@/store/slices/globalsSlice'

import {
	listProducts,
	listProductsItemsCount,
	listProductsStatus,
	ListProductViewType,
	ListCartProductId,
	setProductIimagesItem,
	selectProductById,
	clearCartProductId,
	setShowProductOptions,
	clearShowProductOptions,
	setShowProductOptionsId,
	clearShowProductOptionsId,
	ProductOptionsShow,
	ProductOptionsId,
} from '@/store/slices/productsSlice'

import styles from '@/styles/Home.module.css'
import { useEffect, useRef } from 'react'
import { HeaderCart } from '@/components/app/shop/header/HeaderCart'
import { ClonedImage } from '@/components/app/shop/ClonedImage'
import Popuper from '@/components/app/Popuper'
import { ProductOptions } from '@/components/app/shop/ProductOptions'
import { BreadcrumbsList } from '@/components/app/BreadcrumbsList'
import { HeaderSearch } from '@/components/app/shop/header/HeaderSearch'

export function MainLayout(props) {
	const dispatch = useDispatch()
	const rounter = useRouter()
	const langSettings = useSelector(listLangSettings)
	const settingsStatus = useSelector(listSettingsStatus)
	const languages = useSelector(listLanguages)
	const translations = useSelector(listTranslations)

	const optionsShown = useSelector(ProductOptionsShow)
	const optionsProductId = useSelector(ProductOptionsId)

	const setLang = (lang) => {
		if (checkCookies('lang')) {
			removeCookies('lang')
		}
		const today = new Date()
		setCookies('lang', lang, {
			expires: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 7),
			sameSite: 'None',
		})
	}

	const handleScroll = () => {
		if (window.scrollY > 90) {
			document.querySelector('header').classList.add('scrolled')
		} else {
			document.querySelector('header').classList.remove('scrolled')
		}
	}

	const doCloseOptions = () => {
		dispatch(clearShowProductOptions())
	}

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<>
			<HeadBlock props={props} />
			<div className="page-wrapper">
				<header>
					<div className="container">
						<div className="header-content">
							<nav>
								<Link href={'/'}>Home</Link>
								<Link href={'/about'}>About</Link>
								<Link href={'/catalog'}>Каталог</Link>
								<Link href={'/blog'}>Блог</Link>
								<Link href={'/account'}>Account</Link>
							</nav>
							<HeaderSearch />
							<HeaderCart />
							{settingsStatus === 'succeeded' && (
								<div>
									{languages.map((item) => (
										<button
											type="button"
											onClick={() => setLang(item.locale)}
											className="btn btn-blue"
											key={item.locale}
										>
											{item.name}
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				</header>
				<main>
					{(props.h1 || props.breadcrumbs) && (
						<div className="container">
							<div className="h1-breadcrumbs">
								{props.h1 && <h1>{props.h1}</h1>}
								{props.breadcrumbs && (
									<BreadcrumbsList breadcrumbs={props.breadcrumbs} />
								)}
							</div>
						</div>
					)}
					{props.children}
				</main>
				<footer className={styles.footer}>
					<a
						href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						Powered by{' '}
						<span className={styles.logo}>
							<Image
								src="/vercel.svg"
								alt="Vercel Logo"
								width={72}
								height={16}
							/>
						</span>
					</a>
				</footer>
			</div>
			<ClonedImage />
			<Popuper
				opened={optionsShown}
				closeHandler={doCloseOptions}
				unmountHandler={null}
				width={'500px'}
				height={undefined}
				contentType={undefined}
			>
				<ProductOptions showQuantity={false} productPage={false} />
			</Popuper>
		</>
	)
}
