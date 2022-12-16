import Image from 'next/image'
import { ListClonedImage } from '@/store/slices/productsSlice'
import { useSelector } from 'react-redux'
import { REACT_APP_IMAGE_URL } from 'config'

export const ClonedImage = () => {
	const clonedImage = useSelector(ListClonedImage)

	return (
		<div className="image-cloned" id="image-cloned-for-gsap">
			{clonedImage !== null && (
				<Image
					src={REACT_APP_IMAGE_URL + clonedImage.thumb}
					alt={clonedImage.name}
					layout="responsive"
					width={'100%'}
					height={clonedImage.height}
					objectFit="contain"
				/>
			)}
		</div>
	)
}
