import { listTranslations } from '@/store/slices/globalsSlice'
import {
	listCartProducts,
	listCartPayments,
	listCurrentPayment,
	listCartDeliveries,
	listCurrentDelivery,
	setCurrentDelivery,
	setCurrentPayment,
} from '@/store/slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { CartItem } from './CartItem'
import { DeliveryList } from './DeliveryList'
import { PaymentList } from './PaymentList'
import { Address } from './Address'
import { Person } from './Person'
import { useEffect } from 'react'
import { Comment } from './Comment'

export const Cart = () => {
	const dispatch = useDispatch()
	const translations = useSelector(listTranslations)
	const cartProducts = useSelector(listCartProducts)

	const cartPayments = useSelector(listCartPayments)
	const currentPayment = useSelector(listCurrentPayment)
	const cartDeliveries = useSelector(listCartDeliveries)
	const currentDelivery = useSelector(listCurrentDelivery)

	useEffect(() => {
		if (!currentPayment.code) {
			const first = cartPayments[0] ? cartPayments[0] : false
			if (first) {
				dispatch(setCurrentPayment(first.code))
			}
		}
		if (!currentDelivery.code) {
			const first = cartDeliveries[0] ? cartDeliveries[0] : false
			if (first) {
				const firstQquote = first.quote_items[0] ? first.quote_items[0] : false
				if (firstQquote) {
					dispatch(setCurrentDelivery(firstQquote.code))
				}
			}
		}
		// eslint-disable-next-line
	}, [])

	if (cartProducts.length === 0) {
		return (
			<div className="cart-page__content">
				<p style={{ marginTop: '10px' }}>{translations('CartIsEmpty')}</p>
			</div>
		)
	}

	return (
		<div className="cart-page__content">
			<div className="cart-page__products">
				{cartProducts.map((product) => (
					<CartItem product={product} key={product.cart_id} />
				))}
			</div>
			<Person />
			<Address />
			<DeliveryList />
			<PaymentList />
			<Comment />
		</div>
	)
}
