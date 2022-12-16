import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import gsap from 'gsap'
import { REACT_APP_IMAGE_URL } from 'config'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/store/slices/cartSlice'
import { listTranslations } from '@/store/slices/globalsSlice'
import {
	setProductIimagesItem,
	setClonedImage,
	clearClonedImage,
	setCartProductId,
	clearCartProductId,
	ListCartProductId,
	selectProductById,
	setShowProductOptions,
	setShowProductOptionsId,
	clearShowProductOptions,
	clearShowProductOptionsId,
	ProductOptionsShow,
	clearOptionsUpdated,
	isOptionsUpdated,
	ListCurOptions,
	listQuantity,
	ProductOptionsId,
	assignProductOption,
	setQuantity,
} from '@/store/slices/productsSlice'
import { ProductTileAttrs } from '@/components/app/shop/ProductTileAttrs'
import { PriceBlock } from '@/components/app/shop/PriceBlock'

const gsapImg = '#image-cloned-for-gsap'
const optionsWithValue = ['text', 'textarea', 'date', 'datetime', 'time']

export const ProductTile = ({
	product,
	productEnter,
	productLeave,
	sliding,
}) => {
	const dispatch = useDispatch()
	const image = useRef(null)
	const [timeLine, setTimeLine] = useState(null)

	const optionsUpdated = useSelector(isOptionsUpdated)
	const curOptions = useSelector(ListCurOptions)
	const quantity = useSelector(listQuantity)
	const optionsProducId = useSelector(ProductOptionsId)

	const translations = useSelector(listTranslations)

	const pushToCart = (withOptions = false) => {
		const options = {}
		if (withOptions) {
			curOptions(false).map((option) => {
				if (optionsWithValue.includes(option.type)) {
					options[option.product_option_id] = option.value
				} else if (option.type === 'checkbox') {
					options[option.product_option_id] = []
					option.product_option_value.map((value) => {
						if (value.is_selected) {
							options[option.product_option_id].push(
								value.product_option_value_id
							)
						}
					})
				} else {
					options[option.product_option_id] = option.product_option_value.find(
						(oValue) => oValue.is_selected
					).product_option_value_id
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
		cartProductFly()
	}

	useEffect(() => {
		if (optionsUpdated(false)) {
			if (optionsProducId === product.id) {
				dispatch(clearOptionsUpdated({ page: false }))
				dispatch(clearShowProductOptions())
				cartProductFly(true)
				setTimeout(() => {
					dispatch(clearShowProductOptionsId())
				}, 300)
			}
		}
		// eslint-disable-next-line
	}, [optionsUpdated(false)])

	const cartProductFly = (withOptions = false) => {
		const sizes = image.current.getBoundingClientRect()
		const cartSizes = document
			.querySelector('#cart-header')
			.getBoundingClientRect()

		if (timeLine) {
			timeLine.kill()
		}

		dispatch(
			setClonedImage({
				thumb: product.images[product.image_item].thumb,
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
				x: cartSizes.x - sizes.x,
				y: cartSizes.y - sizes.y,
				width: cartSizes.width,
				height: cartSizes.height,
				rotation: 360,
				ease: 'power2.inOut',
				onComplete: () => pushToCart(withOptions),
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
			<div
				className={classnames('product-item__tile', {
					'product-tile__sliding': sliding,
				})}
			>
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
						<a>
							<Image
								onMouseEnter={productEnter}
								onMouseLeave={productLeave}
								src={
									REACT_APP_IMAGE_URL + product.images[product.image_item].thumb
								}
								alt={product.name}
								layout="responsive"
								width={'100%'}
								height={'100%'}
								objectFit="cover"
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
							type="button"
							className="btn btn-blue"
							onClick={cartClickHandler}
						>
							{translations('CartAddToCart')}
						</button>
					</span>
				</span>
			</div>
		</li>
	)
}
