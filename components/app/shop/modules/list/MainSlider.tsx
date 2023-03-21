import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { getNewID, REACT_APP_IMAGE_URL } from 'config'
import { MainSliderPlaceholder } from '../placeholders/MainSliderPlaceholder'
import { MainSliderContent, MainSliderSettings } from 'types'

interface MainSliderProps {
	content: MainSliderContent
	settings: MainSliderSettings
	localKey: string
}

export const MainSlider = ({
	content,
	settings,
	localKey,
}: MainSliderProps) => {
	if (!content) {
		return <MainSliderPlaceholder settings={settings} localKey={localKey} />
	}

	return (
		<>
			<Swiper
				modules={[Navigation, Pagination]}
				effect={'coverflow'}
				spaceBetween={50}
				slidesPerView={parseInt(content.visible)}
				navigation
				pagination={{ clickable: true }}
				//				onSlideChange={() => console.log('slide change')}
				//				onSwiper={(swiper) => console.log(swiper)}
			>
				{content.images.map((image) => (
					<SwiperSlide key={localKey + '-slider-' + image.id}>
						{image.link !== '' && (
							<Link href={image.link}>
								<a className="slider-tile">
									<Image
										src={REACT_APP_IMAGE_URL + image.image}
										alt={image.title}
										width={content.width + 'px'}
										height={content.height + 'px'}
										objectFit="contain"
									/>
								</a>
							</Link>
						)}
						{image.link === '' && (
							<div className="slider-tile">
								<Image
									src={REACT_APP_IMAGE_URL + image.image}
									alt={image.title}
									width={content.width + 'px'}
									height={content.height + 'px'}
									objectFit="contain"
								/>
							</div>
						)}
					</SwiperSlide>
				))}
			</Swiper>
		</>
	)
}
