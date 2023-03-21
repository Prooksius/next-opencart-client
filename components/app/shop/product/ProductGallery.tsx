import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Controller } from 'swiper'
import { REACT_APP_IMAGE_URL } from 'config'
import { useState } from 'react'
import { TProduct } from '@/store/slices/productsSlice'

interface ProductGalleryProps {
	product: TProduct
}

export const ProductGallery = ({ product }: ProductGalleryProps) => {
	const [firstSwiper, setFirstSwiper] = useState<any | undefined>(undefined)
	const [secondSwiper, setSecondSwiper] = useState<any | undefined>(undefined)

	return (
		<>
			<Swiper
				onSwiper={setFirstSwiper}
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
	)
}
