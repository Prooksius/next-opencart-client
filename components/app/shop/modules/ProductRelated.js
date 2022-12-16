import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper'
import { ProductTile } from '../ProductTile'
import { useEffect, useState } from 'react'

export const ProductRelated = ({ relateds }) => {
	const [products, setProducts] = useState(relateds)
	const [timer, setTimer] = useState(10)
	const [handle, setHandle] = useState(null)
	const [hoverProductId, setHoverProductId] = useState(null)
	const [sliding, setSliding] = useState(false)

	const decrementTimer = () => {
		setTimer((oldTimer) => (oldTimer > 0 ? oldTimer - 1 : 0))
	}

	const installTimer = () => {
		if (!handle) {
			setHandle(setInterval(decrementTimer, 100))
			setHoverProductId(null)
		}
	}

	const uninstallTimer = () => {
		if (handle) {
			clearInterval(handle)
			setHandle(null)
			setHoverProductId(null)
			setTimer(10)
			if (hoverProductId) {
				setProductIimagesItem({
					id: hoverProductId,
					index: 0,
				})
			}
		}
	}

	const productById = (productId) => {
		return products.find((item) => +item.id === +productId)
	}

	const setProductIimagesItem = ({ id, index }) => {
		const newProducts = [...products]

		const found = newProducts.find((item) => +item.id === +id)
		if (found) {
			found.image_item = +index
			setProducts(newProducts)
		}
	}

	const hoverProductEnter = (item) => {
		setHoverProductId(item.id)
		setTimer(10)
	}

	const hoverProductLeave = () => {
		setProductIimagesItem({
			id: hoverProductId,
			index: 0,
		})
		setHoverProductId(null)
		setTimer(0)
		setSliding(false)
	}

	useEffect(() => {
		if (hoverProductId && handle && timer === 0) {
			setSliding(true)
			setProductIimagesItem({
				id: hoverProductId,
				index:
					productById(hoverProductId).image_item <
					productById(hoverProductId).images.length - 1
						? productById(hoverProductId).image_item + 1
						: 0,
			})
			setTimer(10)
		}
		// eslint-disable-next-line
	}, [timer])

	useEffect(() => {
		installTimer()
		return uninstallTimer
		// eslint-disable-next-line
	}, [])

	return (
		<>
			<Swiper
				spaceBetween={25}
				slidesPerView={4}
				navigation={true}
				pagination={{ clickable: true }}
				modules={[Navigation, Pagination]}
				className="related-swiper"
			>
				{products.map((product) => (
					<SwiperSlide key={product.id}>
						<ProductTile
							product={product}
							productEnter={() => hoverProductEnter(product)}
							productLeave={hoverProductLeave}
							sliding={sliding && product.id === hoverProductId}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</>
	)
}
