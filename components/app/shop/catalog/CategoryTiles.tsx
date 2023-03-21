import Link from 'next/link'
import Image from 'next/image'
import range from 'lodash.range'
import { REACT_APP_IMAGE_URL } from 'config'
import { TCategory } from '@/store/slices/categoriesSlice'

interface CategoryTilesProps {
	roots: TCategory[] | null
}

export const CategoryTiles = ({ roots }: CategoryTilesProps) => {
	const defRoots = range(8)
	return (
		<div className="catalog-area">
			<div className="catalog-tiles">
				{roots &&
					roots.map((item) => (
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
				{!roots &&
					defRoots.map((item, index) => (
						<div className="catalog-tiles__item" key={index}>
							<div className="catalog-tiles__item-content">
								<span className="image">
									<span
										className="skeleton-box"
										style={{ width: '100%', paddingBottom: '100%' }}
									></span>
								</span>
								<span className="title">
									<span
										className="skeleton-box"
										style={{ width: '70%' }}
									></span>
								</span>
							</div>
						</div>
					))}
			</div>
		</div>
	)
}
