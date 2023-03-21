import { REACT_APP_IMAGE_URL } from 'config'
import Image from 'next/image'
import { listTranslations, listCurrency } from '@/store/slices/globalsSlice'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { numberFormat } from 'config'
import { TCartTotal } from 'types'

interface CartTotalItemProps {
	item: TCartTotal
}

export const CartTotalItem = ({ item }: CartTotalItemProps) => {
	const translations = useSelector(listTranslations)
	const currency = useSelector(listCurrency)

	const [cartTotal, setCartTotal] = useState(item.value)

	useEffect(() => {
		if (cartTotal !== item.value) {
			const cartCost = { value: cartTotal, endValue: item.value }

			gsap.to(cartCost, {
				value: cartCost.endValue,
				duration: 0.5,
				onUpdate: () => {
					setCartTotal(cartCost.value)
				},
			})
		}
		// eslint-disable-next-line
	}, [item.value])

	if (!currency) {
		return null
	}

	return (
		<div className="page-cart__total">
			<span className="total-title">{item.title}:</span>
			<span className="total-value">
				<b
					dangerouslySetInnerHTML={{
						__html:
							'&nbsp;' +
							currency.symbol_left +
							numberFormat(cartTotal, currency?.decimal_place, '.', '&nbsp;') +
							currency.symbol_right,
					}}
				></b>
			</span>
		</div>
	)
}
