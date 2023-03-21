import { HeadBlock } from './HeadBlock'
import Link from 'next/link'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { setCookies, checkCookies, removeCookies } from 'cookies-next'

import {
	listSettingsStatus,
	listLanguages,
	listTranslations,
} from '@/store/slices/globalsSlice'

import {
	clearShowProductOptions,
	ProductOptionsShow,
} from '@/store/slices/productsSlice'

import styles from '@/styles/Home.module.css'
import { useEffect, useRef } from 'react'
import { HeaderCart } from '@/components/app/shop/header/HeaderCart'
import { ClonedImage } from '@/components/app/shop/product/ClonedImage'
import { Popuper } from '@/components/app/shop/global/Popuper'
import { ProductOptions } from '@/components/app/shop/product/ProductOptions'
import { BreadcrumbsList } from '@/components/app/shop/global/BreadcrumbsList'
import { HeaderSearch } from '@/components/app/shop/header/HeaderSearch'
import { TBreadcrumb, TLanguage, TModulePage } from 'types'
import { AppDispatch } from '@/store/store'
import { HeaderFavourites } from '@/components/app/shop/header/HeaderFavourites'
import { ModulesByPlace } from '@/components/app/shop/modules/ModulesByPlace'
import { HeaderCompares } from '@/components/app/shop/header/HeaderCompares'

interface MainLayoutProps {
	h1?: string
	title?: string
	path?: string
	page?: number
	totalPages?: number
	pageCode: string
	pageContents?: TModulePage | null
	breadcrumbs?: TBreadcrumb[] | null
	children: React.ReactNode
}

export const MainLayout = ({
	h1 = '',
	title = '',
	path = '/',
	page = 1,
	totalPages = 1,
	breadcrumbs = [],
	pageCode,
	pageContents = null,
	children,
}: MainLayoutProps) => {
	const dispatch = useDispatch<AppDispatch>()
	const settingsStatus = useSelector(listSettingsStatus)
	const languages = useSelector(listLanguages)
	const translations = useSelector(listTranslations)

	const optionsShown = useSelector(ProductOptionsShow)

	const setLang = (lang: string) => {
		if (checkCookies('lang')) {
			removeCookies('lang')
		}
		const today = new Date()
		setCookies('lang', lang, {
			expires: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 7),
			sameSite: 'none',
		})
	}

	const handleScroll = () => {
		const header = document.querySelector('header')
		if (header) {
			if (window.scrollY > 90) {
				header.classList.add('scrolled')
			} else {
				header.classList.remove('scrolled')
			}
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
			<HeadBlock
				title={title}
				h1={h1}
				page={page}
				path={path}
				totalPages={totalPages}
			/>
			<div className="page-wrapper">
				<header>
					<div className="container">
						<div className="header-content">
							<nav>
								<Link href={'/'}>Home</Link>
								<Link href={'/about'}>About</Link>
								<Link href={'/catalog'}>Каталог</Link>
								<Link href={'/products/special'}>Скидки</Link>
								<Link href={'/blog'}>Блог</Link>
							</nav>
							<HeaderSearch />
							<HeaderCart />
							<HeaderFavourites />
							<HeaderCompares />
							{settingsStatus === 'succeeded' && (
								<div>
									{languages?.map((item: TLanguage) => (
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
					{(h1 || breadcrumbs) && (
						<div className="container">
							<div className="h1-breadcrumbs">
								{h1 && <h1>{h1}</h1>}
								{breadcrumbs && breadcrumbs.length > 0 && (
									<BreadcrumbsList breadcrumbs={breadcrumbs} />
								)}
							</div>
						</div>
					)}
					<div className="container">
						<ModulesByPlace
							pageCode={pageCode}
							position={'page-top'}
							content={pageContents}
						/>
						<ModulesByPlace
							pageCode={pageCode}
							position={'content-top'}
							content={pageContents}
						/>
						{children}
						<ModulesByPlace
							pageCode={pageCode}
							position={'content-bottom'}
							content={pageContents}
						/>
						<ModulesByPlace
							pageCode={pageCode}
							position={'page-bottom'}
							content={pageContents}
						/>
					</div>
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
				unmountHandler={() => {}}
				width={'500px'}
			>
				<ProductOptions showQuantity={false} productPage={false} />
			</Popuper>
		</>
	)
}
