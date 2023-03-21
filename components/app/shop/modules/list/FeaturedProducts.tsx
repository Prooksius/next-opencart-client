import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper'
import { ProductTile } from '@/components/app/shop/product/ProductTile'
import { FeaturedPlaceholder } from '../placeholders/FeaturedPlaceholder'
import { FeaturedProductsContent, FeaturedProductsSettings } from 'types'

interface FeaturedProductsProps {
  content: FeaturedProductsContent
  visible: number
}

export const FeaturedProducts = ({ content, visible }: FeaturedProductsProps) => {
	if (!content) {
		return <FeaturedPlaceholder visible={visible} />
	}

	if (!content.products || content.products.length === 0) {
		return null
	}

	return (
		<div className="prodiuct-featured__cont">
			{content.title !== '' && <h2>{content.title}</h2>}
			{content.subtitle !== '' && <p>{content.subtitle}</p>}
			<Swiper
				spaceBetween={25}
				slidesPerView={Number(content.visible) || 1}
				navigation={true}
				pagination={{ clickable: true }}
				modules={[Navigation, Pagination]}
				className="related-swiper"
			>
				{content.products.map((product) => (
					<SwiperSlide key={product.id}>
						<ProductTile product={product} />
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}
