import { useSelector } from 'react-redux'
import Link from 'next/link'
import CompareIcon from '@mui/icons-material/Compare'
import { listComparesCount } from '@/store/slices/productsSlice'

export const HeaderCompares = () => {
	const comparesCount = useSelector(listComparesCount)

	return (
		<Link href={'/products/compare'}>
			<a className="cart-header" id="compares-header">
				<CompareIcon />
				{comparesCount > 0 && (
					<span className="cart-header__cart-count">{comparesCount}</span>
				)}
			</a>
		</Link>
	)
}
