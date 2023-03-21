import { REACT_APP_IMAGE_URL } from 'config'
import Image from 'next/image'
import { listTranslations, listCurrency } from '@/store/slices/globalsSlice'
import {
	listCartTotals,
	listCartProducts,
	listCustomerComment,
	confirmOrder,
} from '@/store/slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { CartTotalItem } from './CartTotalItem'
import { AppDispatch } from '@/store/store'

export const CartTotals = () => {
	const translations = useSelector(listTranslations)
	const cartTotals = useSelector(listCartTotals)
	const dispatch = useDispatch<AppDispatch>()

	const cartProducts = useSelector(listCartProducts)
	const customerComment = useSelector(listCustomerComment)

	const doConfirmOrder = () => {
		dispatch(confirmOrder({ comment: customerComment }))
	}

	if (!cartProducts.length) {
		return null
	}

	return (
		<div className="page-cart__totals">
			<div className="page-cart__totals-list">
				{cartTotals.map((total) => (
					<CartTotalItem key={total.code} item={total} />
				))}
			</div>
			<button type="button" className="btn btn-blue" onClick={doConfirmOrder}>
				{translations('CheckoutConfirmOrder')}
			</button>
		</div>
	)
}
