import { REACT_APP_IMAGE_URL } from 'config'
import Image from 'next/image'
import {
	getCookie,
	setCookies,
	checkCookies,
	removeCookies,
} from 'cookies-next'
import { listTranslations, listCurrency } from '@/store/slices/globalsSlice'
import {
	listCartPayments,
	listCurrentPayment,
	fetchCart,
	setCurrentPayment,
} from '@/store/slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

export const PaymentList = () => {
	const dispatch = useDispatch()
	const translations = useSelector(listTranslations)
	const cartPayments = useSelector(listCartPayments)
	const currentPayment = useSelector(listCurrentPayment)

	const doChangePayment = (code) => {
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
