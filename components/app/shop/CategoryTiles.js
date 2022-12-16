import Link from 'next/link'
import Image from 'next/image'
import { REACT_APP_IMAGE_URL } from 'config'

export const CategoryTiles = ({ roots }) => {
	return (
		<div className="catalog-area">
			<div className="catalog-tiles">
				{roots.map((item) => (
					<div className="catalog-tiles__item" key={item.id}>
						<Link href={`/catalog/${item.alias}`}>
							<a className="catalog-tiles__item-content">
								<span className="image">
									<Image
										src={REACT_APP_IMAGE_URL + item.thumb}
										alt={item.name}
										layout="responsive"
										width={'100%'}
										height={'100%'}
										objectFit="cover"
									/>
								</span>
								<span className="title">{item.name}</span>
							</a>
						</Link>
					</div>
				))}
			</div>
		</div>
	)
}
