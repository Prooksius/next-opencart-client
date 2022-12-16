import { PriceBlock } from '@/components/app/shop/PriceBlock'
import { ProductOptions } from '@/components/app/shop/ProductOptions'
import { addToCart } from '@/store/slices/cartSlice'
import { optionsWithValue } from 'config'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
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
	assignProductOption,
	ListCurOptions,
	listQuantity,
	ProductOptionsId,
	setQuantity,
	ListPageImageIndex,
} from '@/store/slices/productsSlice'
import { useEffect, useState } from 'react'
import { ProductOtherColors } from '@/components/app/shop/ProductOtherColors'

const gsapImg = '#image-cloned-for-gsap'

export const ProductRightSide = ({ product, setProduct }) => {
	const dispatch = useDispatch()

	const [timeLine, setTimeLine] = useState(null)

	const optionsUpdated = useSelector(isOptionsUpdated)
	const curOptions = useSelector(ListCurOptions)
	const quantity = useSelector(listQuantity)
	const optionsProducId = useSelector(ProductOptionsId)

	const pageImageIndex = useSelector(ListPageImageIndex)

	const pushToCart = () => {
		const options = {}
		if (curOptions(true).length) {
			curOptions(true).map((option) => {
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
			dispatch(
				addToCart({
					product_id: product.id,
					quantity: quantity(true),
					option: options,
				})
			)
		} else {
			dispatch(
				addToCart({
					product_id: product.id,
					quantity: quantity(true),
					option: [],
				})
			)
		}
	}

	useEffect(() => {
		console.log('optionsUpdated', optionsProducId)
		if (optionsUpdated(true)) {
			dispatch(clearOptionsUpdated({ page: true }))
			dispatch(clearShowProductOptions())
			cartProductFly()
			setTimeout(() => {
				dispatch(clearShowProductOptionsId())
			}, 300)
		}
		// eslint-disable-next-line
	}, [optionsUpdated(true)])

	useEffect(() => {
		dispatch(assignProductOption({ page: true, options: product.options }))
		dispatch(
			setQuantity({
				page: true,
				quantity: product.minimum ? product.minimum : 1,
			})
		)
		// eslint-disable-next-line
	}, [])

	const doClearClonedImage = () => {
		dispatch(clearClonedImage())
	}

	const cartProductFly = () => {
		const sizes = document
			.querySelector(
				'.product-layout__main .mySwiper-main .swiper-slide-active'
			)
			.getBoundingClientRect()
		const cartSizes = document
			.querySelector('#cart-header')
			.getBoundingClientRect()

		if (timeLine) {
			timeLine.kill()
		}

		dispatch(
			setClonedImage({
				thumb: product.images[pageImageIndex].thumb_big,
				name: product.name,
				height: '57%',
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
				onComplete: () => pushToCart(),
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
		<>
			<p>
				Производитель: <b>{product.manufacturer}</b>
			</p>
			<p>
				Модель: <b>{product.model}</b>
			</p>
			<p>
				Артикул: <b>{product.sku}</b>
			</p>
			<br />
			<div>
				<PriceBlock product={product} />
			</div>
			<br />
			<ProductOtherColors product={product} />
			<ProductOptions showQuantity={true} productPage={true} />
		</>
	)
}
