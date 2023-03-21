import { listTranslations, listCurrency } from '@/store/slices/globalsSlice'
import {
	listCartDeliveries,
	listCurrentDelivery,
	fetchCart,
	setCurrentDelivery,
} from '@/store/slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { AppDispatch } from '@/store/store'

export const DeliveryList = () => {
	const dispatch = useDispatch<AppDispatch>()
	const translations = useSelector(listTranslations)
	const currency = useSelector(listCurrency)
	const cartDeliveries = useSelector(listCartDeliveries)
	const currentDelivery = useSelector(listCurrentDelivery)

	const doChangeDelivery = (code: string) => {
		dispatch(setCurrentDelivery(code))
	}

	useEffect(() => {
		if (currentDelivery?.code) {
			console.log('method changed: ', currentDelivery.code)
			dispatch(fetchCart())
		}
		// eslint-disable-next-line
	}, [currentDelivery?.code])

	return (
		<div className="page-cart__deliveries">
			<h3>{translations('CheckoutDeliveryList')}</h3>
			текущий: {currentDelivery?.code}
			<div className="page-cart__deliveries-list">
				{cartDeliveries.map((delivery) => (
					<div className="page-cart__delivery" key={delivery.code}>
						<span className="delivery-title">{delivery.title}</span>
						<div className="delivery-quotes">
							{delivery.quote_items.map((item) => (
								<div className="delivery-quote" key={item.code}>
									<label>
										<input
											type="radio"
											value={item.code}
											readOnly
											checked={currentDelivery.code === item.code}
											onClick={() => doChangeDelivery(item.code)}
										/>
										<span className="delivery-title"> {item.title} </span>(
										<span
											className="delivery-cost"
											dangerouslySetInnerHTML={{
												__html: item.text,
											}}
										></span>
										)
									</label>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
