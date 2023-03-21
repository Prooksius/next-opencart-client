import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper'
import { ProductTile } from '../product/ProductTile'
import { TProduct } from '@/store/slices/productsSlice'

interface ProductRelatedProps {
	relateds: TProduct[]
}

export const ProductRelated = ({ relateds }: ProductRelatedProps) => {
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
				{relateds.map((product) => (
					<SwiperSlide key={product.id}>
						<ProductTile product={product} />
					</SwiperSlide>
				))}
			</Swiper>
		</>
	)
}
