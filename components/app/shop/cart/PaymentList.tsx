import { listTranslations } from '@/store/slices/globalsSlice'
import {
	listCartPayments,
	listCurrentPayment,
	fetchCart,
	setCurrentPayment,
} from '@/store/slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { AppDispatch } from '@/store/store'

export const PaymentList = () => {
	const dispatch = useDispatch<AppDispatch>()
	const translations = useSelector(listTranslations)
	const cartPayments = useSelector(listCartPayments)
	const currentPayment = useSelector(listCurrentPayment)

	const doChangePayment = (code: string) => {
		dispatch(setCurrentPayment(code))
	}

	useEffect(() => {
		if (currentPayment.code) {
			console.log('method changed: ', currentPayment.code)
			dispatch(fetchCart())
		}
		// eslint-disable-next-line
	}, [currentPayment.code])

	return (
		<div className="page-cart__payments">
			<h3>{translations('CheckoutPaymentList')}</h3>
			текущий: {currentPayment.code}
			<div className="page-cart__payments-list">
				{cartPayments.map((payment) => (
					<div className="page-cart__payment" key={payment.code}>
						<label>
							<input
								type="radio"
								value={payment.code}
								readOnly
								checked={currentPayment.code === payment.code}
								onClick={() => doChangePayment(payment.code)}
							/>
							<span className="delivery-title">{payment.title}</span>
						</label>
					</div>
				))}
			</div>
		</div>
	)
}
