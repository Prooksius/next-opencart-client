import { REACT_APP_IMAGE_URL } from '@/config'
import Image from 'next/image'
import { TProductImage } from '@/store/slices/productsSlice'

interface HoverImageProps {
	images: TProductImage[]
	name: string
	imageIndex: number
}

const HoverImage = ({ images, name, imageIndex }: HoverImageProps) => {
	return (
		<Image
			src={REACT_APP_IMAGE_URL + images[imageIndex].thumb}
			alt={name}
			layout="responsive"
			width={'100%'}
			height={'100%'}
			objectFit="cover"
		/>
	)
}

export default HoverImage
