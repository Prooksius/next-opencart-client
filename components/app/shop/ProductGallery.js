import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Controller, EffectFade } from 'swiper'
import { REACT_APP_IMAGE_URL } from 'config'
import { useState } from 'react'
import { ProductRightSide } from '@/components/app/shop/ProductRightSide'
import { useDispatch, useSelector } from 'react-redux'
import { setPageImageIndex } from '@/store/slices/productsSlice'

export const ProductGallery = ({ product, setProduct }) => {
	const dispatch = useDispatch()

	const [firstSwiper, setFirstSwiper] = useState(null)
	const [secondSwiper, setSecondSwiper] = useState(null)

	const doChangeSlide = (swiper) => {
		dispatch(setPageImageIndex(swiper.activeIndex))
	}

	return (
		<div className="product-layout">
			<div className="product-layout__main">
				{product.images.length > 0 && (
					<>
						<Swiper
							onSwiper={setFirstSwiper}
							onSlideChange={doChangeSlide}
							controller={{ control: secondSwiper }}
							spaceBetween={50}
							centeredSlides={true}
							navigation={true}
							modules={[Navigation, Controller]}
							className="mySwiper-main"
						>
							{product.images.map((image) => (
								<SwiperSlide key={1 + '-' + image.id}>
									<Image
										src={REACT_APP_IMAGE_URL + image.image}
										alt={product.name}
										layout="responsive"
										width={'100%'}
										height={'57%'}
										objectFit="contain"
									/>
								</SwiperSlide>
							))}
						</Swiper>
						<Swiper
							onSwiper={setSecondSwiper}
							controller={{ control: firstSwiper }}
							centeredSlides={true}
							spaceBetween={10}
							slidesPerView={4}
							slideToClickedSlide={true}
							watchSlidesProgress={true}
							modules={[Navigation, Controller]}
							className="mySwiper-gallery"
						>
							{product.images.map((image) => (
								<SwiperSlide key={2 + '-' + image.id}>
									<Image
										src={REACT_APP_IMAGE_URL + image.thumb_gallery}
										alt={product.name}
										layout="responsive"
										width={'100%'}
										height={'50%'}
										objectFit="contain"
									/>
								</SwiperSlide>
							))}
						</Swiper>
					</>
				)}
			</div>
			<div className="product-layout__right">
				<ProductRightSide product={product} setProduct={setProduct} />
			</div>
		</div>
	)
}
