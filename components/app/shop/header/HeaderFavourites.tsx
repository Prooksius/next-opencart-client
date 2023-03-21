import { useSelector } from 'react-redux'
import Link from 'next/link'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { listFavouritesCount } from '@/store/slices/productsSlice'

export const HeaderFavourites = () => {
	const favouritesCount = useSelector(listFavouritesCount)

	return (
		<Link href={'/products/favourite'}>
			<a className="cart-header" id="favourites-header">
				<FavoriteIcon />
				{favouritesCount > 0 && (
					<span className="cart-header__cart-count">{favouritesCount}</span>
				)}
			</a>
		</Link>
	)
}
