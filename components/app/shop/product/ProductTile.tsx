import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import gsap from 'gsap'
import { REACT_APP_IMAGE_URL } from 'config'
import {
	getCookie,
	checkCookies,
	setCookies,
	removeCookies,
} from 'cookies-next'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/store/slices/cartSlice'
import { listTranslations } from '@/store/slices/globalsSlice'
import {
	setClonedImage,
	clearClonedImage,
	setShowProductOptions,
	setShowProductOptionsId,
	clearShowProductOptions,
	clearShowProductOptionsId,
	clearOptionsUpdated,
	isOptionsUpdated,
	ListCurOptions,
	listQuantity,
	ProductOptionsId,
	assignProductOption,
	setQuantity,
	addToFavourites,
	removeFromFavourites,
	addToCompares,
	removeFromCompares,
	TProduct,
	selectProductById,
} from '@/store/slices/productsSlice'
import { ProductTileAttrs } from '@/components/app/shop/product/ProductTileAttrs'
import { PriceBlock } from '@/components/app/shop/product/PriceBlock'
import HoverImage from './HoverImage'
import { TCartSelectedOptions } from 'types'
import { AppDispatch } from '@/store/store'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CompareIcon from '@mui/icons-material/Compare'

const gsapImg = '#image-cloned-for-gsap'
const optionsWithValue = ['text', 'textarea', 'date', 'datetime', 'time']

interface ProductTileProps {
	product: TProduct
	isInFavourites?: boolean
	isInCompares?: boolean
}

export const ProductTile = ({
	product,
	isInFavourites = false,
	isInCompares = false,
}: ProductTileProps) => {
	const dispatch = useDispatch<AppDispatch>()
	const image = useRef<HTMLSpanElement>(null)

	const [imageIndex, setImageIndex] = useState(0)
	const [timer, setTimer] = useState(10)
	const [handle, setHandle] = useState<NodeJS.Timer | null>(null)

	const [timeLine, setTimeLine] = useState<gsap.core.Timeline | null>(null)

	const optionsUpdated = useSelector(isOptionsUpdated)
	const curOptions = useSelector(ListCurOptions)
	const quantity = useSelector(listQuantity)
	const optionsProducId = useSelector(ProductOptionsId)
	const productById = useSelector(selectProductById)

	const translations = useSelector(listTranslations)

	const decrementTimer = () => {
		setTimer((oldTimer) => (oldTimer > 0 ? oldTimer - 1 : 0))
	}

	const installTimer = () => {
		if (!handle) {
			setHandle(setInterval(decrementTimer, 100))
		}
	}

	const uninstallTimer = () => {
		if (handle) {
			clearInterval(handle)
			setHandle(null)
			setTimer(10)
		}
	}

	const hoverProductEnter = () => {
		installTimer()
		setImageIndex(0)
		setTimer(10)
	}

	const hoverProductLeave = () => {
		uninstallTimer()
		setImageIndex(0)
		setTimer(0)
	}

	useEffect(() => {
		if (handle && timer === 0) {
			setImageIndex(imageIndex < product.images.length - 1 ? imageIndex + 1 : 0)
			setTimer(10)
		}
		// eslint-disable-next-line
	}, [timer])

	const setFavorite = (id: number) => {
		let save = false
		let removeId: string | undefined = undefined
		let favourites: string[] = []
		if (checkCookies('favouriteProducts')) {
			const favouritesStr = getCookie('favouriteProducts')
			favourites = JSON.parse(
				typeof favouritesStr === 'string' ? favouritesStr : ''
			)
			if (favourites.constructor !== Array) {
				favourites = []
			}
		}
		const found = favourites.find((item) => +item === id)
		if (!found && !isInFavourites) {
			removeCookies('favouriteProducts')
			favourites.push(id.toString())
			if (favourites.length > 12) {
				removeId = favourites.shift()
			}
			save = true
		} else if (found && isInFavourites) {
			removeCookies('favouriteProducts')
			favourites = favourites.filter((item) => +item !== id)
			removeId = id.toString()
			save = true
		}

		if (save) {
			const today = new Date()
			setCookies('favouriteProducts', JSON.stringify(favourites), {
				expires: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 7),
				sameSite: 'lax',
			})
			if (isInFavourites && removeId) {
				dispatch(removeFromFavourites(+removeId))
			} else if (!isInFavourites) {
				product && dispatch(addToFavourites(product))
				removeId && dispatch(removeFromFavourites(+removeId))
			}
		}
	}

	const addToFavouritesHandler = (id: number) => {
		if (isInFavourites) {
			setFavorite(id)
		} else {
			goProductFly('#favourites-header', () => setFavorite(id))
		}
	}

	const setCompare = (id: number) => {
		let save = false
		let removeId: string | undefined = undefined
		let compares: string[] = []
		if (checkCookies('compareProducts')) {
			const comparesStr = getCookie('compareProducts')
			compares = JSON.parse(typeof comparesStr === 'string' ? comparesStr : '')
			if (compares.constructor !== Array) {
				compares = []
			}
		}
		const found = compares.find((item) => +item === id)
		if (!found && !isInCompares) {
			removeCookies('compareProducts')
			compares.push(id.toString())
			if (compares.length > 12) {
				removeId = compares.shift()
			}
			save = true
		} else if (found && isInCompares) {
			removeCookies('compareProducts')
			compares = compares.filter((item) => +item !== id)
			removeId = id.toString()
			save = true
		}

		if (save) {
			const today = new Date()
			setCookies('compareProducts', JSON.stringify(compares), {
				expires: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 7),
				sameSite: 'lax',
			})
			if (isInCompares && removeId) {
				dispatch(removeFromCompares(+removeId))
			} else if (!isInCompares) {
				product && dispatch(addToCompares(product))
				removeId && dispatch(removeFromCompares(+removeId))
			}
		}
	}

	const addToComparesHandler = (id: number) => {
		if (isInCompares) {
			setCompare(id)
		} else {
			goProductFly('#compares-header', () => setCompare(id))
		}
	}

	const pushToCart = (withOptions = false) => {
		const options: TCartSelectedOptions = {}
		if (withOptions) {
			curOptions(false).map((option) => {
				if (optionsWithValue.includes(option.type)) {
					options[option.product_option_id] = option.value
				} else if (option.type === 'checkbox') {
					options[option.product_option_id] = []
					option.product_option_value.map((value) => {
						if (value.is_selected) {
							;(options[option.product_option_id] as Array<number>).push(
								value.product_option_value_id
							)
						}
					})
				} else {
					options[option.product_option_id] = option.product_option_value.find(
						(oValue) => oValue.is_selected
					)!.product_option_value_id
				}
			})
			console.log('options', options)
			dispatch(
				addToCart({
					product_id: product.id,
					quantity: quantity(false),
					option: options,
				})
			)
		} else {
			dispatch(
				addToCart({
					product_id: product.id,
					quantity: quantity(false),
					option: [],
				})
			)
		}
	}

	const doClearClonedImage = () => {
		dispatch(clearClonedImage())
	}

	const cartClickHandler = () => {
		if (product.options.filter((option) => option.required === true).length) {
			dispatch(setShowProductOptionsId(product.id))
			dispatch(assignProductOption({ page: false, options: product.options }))
			dispatch(
				setQuantity({
					page: false,
					quantity: product.minimum ? product.minimum : 1,
				})
			)
			dispatch(setShowProductOptions())
			return false
		}
		goProductFly('#cart-header', () => pushToCart(false))
	}

	useEffect(() => {
		if (optionsUpdated(false)) {
			if (optionsProducId === product.id) {
				dispatch(clearOptionsUpdated({ page: false }))
				dispatch(clearShowProductOptions())
				goProductFly('#cart-header', () => pushToCart(true))
				setTimeout(() => {
					dispatch(clearShowProductOptionsId())
				}, 300)
			}
		}
		// eslint-disable-next-line
	}, [optionsUpdated(false)])

	const goProductFly = (
		destination: string,
		callback: (params: any) => any
	) => {
		if (!image.current) {
			return false
		}
		const sizes = image.current.getBoundingClientRect()
		const destinationBounds = document
			.querySelector(destination)!
			.getBoundingClientRect()

		if (timeLine) {
			timeLine.kill()
		}

		dispatch(
			setClonedImage({
				thumb: product.images[imageIndex].thumb,
				name: product.name,
				height: '100%',
			})
		)

		const tl = gsap.timeline()
		tl.set(gsapImg, {
			top: sizes.y,
			left: sizes.x,
			width: sizes.width,
			height: sizes.height,
			zIndex: 200,
			opacity: 1,
			scale: 1,
			clearProps: 'x,y',
			visibility: 'visible',
		})
			.to(gsapImg, {
				duration: 1.2,
				x: destinationBounds.x - sizes.x,
				y: destinationBounds.y - sizes.y,
				width: destinationBounds.width,
				height: destinationBounds.height,
				rotation: 360,
				ease: 'power2.inOut',
				onComplete: callback,
			})
			.to(gsapImg, {
				duration: 0.5,
				opacity: 0,
				scale: 0,
				onComplete: doClearClonedImage,
			})
			.set(gsapImg, {
				visibility: 'hidden',
			})
			.play()

		setTimeLine(tl)
	}

	return (
		<li className="list-group-item product-item">
			<span className="image" ref={image}>
				<span className="product-tile__filters-block">
					{product.special_percent !== '' && (
						<span
							className="filter filter-special"
							data-tip={translations('ProductSpecialPrice')}
							data-for="for-top"
						>
							-{product.special_percent}%
						</span>
					)}
					{product.filters.map((filter) => (
						<span
							className="filter"
							data-tip={filter.name}
							data-for="for-top"
							key={'filter' + filter.filter_id + '-' + product.id}
						>
							<Image
								src={REACT_APP_IMAGE_URL + filter.icon}
								alt={filter.name}
								width="24px"
								height="24px"
							/>
						</span>
					))}
				</span>
				<Link href={`/product/${product.alias}`}>
					<a onMouseEnter={hoverProductEnter} onMouseLeave={hoverProductLeave}>
						<HoverImage
							images={product.images}
							name={product.name}
							imageIndex={imageIndex}
						/>
					</a>
				</Link>
			</span>
			<span className="product-item__properties">
				<span className="product-item__property title">
					<Link href={`/product/${product.alias}`}>
						<a> {product.name}</a>
					</Link>
				</span>
				<span className="product-item__property attrinutes">
					<ProductTileAttrs
						attributes={product.attributes}
						productId={product.id}
					/>
				</span>
				<span className="product-item__property price">
					<PriceBlock product={product} />
				</span>
				<span className="product-item__property buttons">
					<button
						className="btn btn-blue"
						type="button"
						onClick={cartClickHandler}
					>
						{translations('CartAddToCart')}
					</button>
					<button
						className="btn btn-blue btn-icon"
						data-tip={translations('ProductAddToFavorites')}
						data-for="for-top"
						onClick={() => addToFavouritesHandler(product.id)}
					>
						{!isInFavourites && <FavoriteIcon />}
						{isInFavourites && '-'}
					</button>
					<button
						className="btn btn-blue btn-icon"
						data-tip={translations('ProductAddToCompare')}
						data-for="for-top"
						onClick={() => addToComparesHandler(product.id)}
					>
						<CompareIcon />
					</button>
				</span>
			</span>
		</li>
	)
}
