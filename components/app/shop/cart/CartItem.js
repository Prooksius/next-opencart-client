import { REACT_APP_IMAGE_URL } from 'config'
import Image from 'next/image'
import { listTranslations, listCurrency } from '@/store/slices/globalsSlice'
import {
	listCartProducts,
	listCartProductsCount,
	listCartTotal,
	listCartTotalNum,
	listCartEditStatus,
	listQuantity,
	listProductTotal,
	listUpdated,
	getUpdatedCount,
	updateCart,
	setQuantity,
	removeFromCart,
} from '@/store/slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useReducer, useState } from 'react'
import { numberFormat } from 'config'
import gsap from 'gsap'
import { QuantityInputSelector } from '@/components/app/misc/QuantityInputSelector'

export const CartItem = ({ product }) => {
	const dispatch = useDispatch()
	const translations = useSelector(listTranslations)
	const currency = useSelector(listCurrency)
	const editStatus = useSelector(listCartEditStatus)
	const selQuantity = useSelector(listQuantity)

	const [productTotal, setProductTotal] = useState(product.total)
	const [productPrice, setProductPrice] = useState(product.price)

	useEffect(() => {
		if (productTotal !== product.total) {
			const productCost = {
				value: productTotal,
				endValue: product.total,
			}

			gsap.to(productCost, {
				value: productCost.endValue,
				duration: 0.5,
				onUpdate: () => {
					setProductTotal(productCost.value)
				},
			})
		}
		// eslint-disable-next-line
	}, [product.total])

	useEffect(() => {
		if (productPrice !== product.price) {
			const productCost = {
				value: productPrice,
				endValue: product.price,
			}

			gsap.to(productCost, {
				value: productCost.endValue,
				duration: 0.5,
				onUpdate: () => {
					setProductPrice(productCost.value)
				},
			})
		}
		// eslint-disable-next-line
	}, [product.price])

	const doRemoveFromCart = (cart_id) => {
		dispatch(removeFromCart(cart_id))
	}

	return (
		<div className="cart-page__product">
			<div className="product-thumb">
				<Image
					src={REACT_APP_IMAGE_URL + product.thumb}
					alt="cart"
					width="120px"
					height="120px"
				/>
			</div>
			<div className="product-name">
				<span>
					<b>{product.name}</b>
				</span>
				{product.option.length > 0 &&
					product.option.map((option, index) => (
						<span key={product.id + '-' + index}>
							-{' '}
							<small>
								{option.name} {option.value}
							</small>
						</span>
					))}
			</div>
			<div className="product-quantity">
				<QuantityInputSelector
					cartID={product.cart_id}
					quantity={selQuantity(product.cart_id)}
					disabled={editStatus === 'loading' || product.quantity < 2}
					updateQuantity={(newQuantity) =>
						dispatch(
							setQuantity({
								cart_id: product.cart_id,
								quantity: newQuantity,
							})
						)
					}
				/>
			</div>
			<div className="product-price">
				<span
					dangerouslySetInnerHTML={{
						__html:
							'&nbsp;' +
							currency.symbol_left +
							numberFormat(
								productPrice,
								currency.decimal_place,
								'.',
								'&nbsp;'
							) +
							currency.symbol_right,
					}}
				></span>
			</div>
			<div className="product-total">
				<span
					dangerouslySetInnerHTML={{
						__html:
							'&nbsp;' +
							currency.symbol_left +
							numberFormat(
								productTotal,
								currency.decimal_place,
								'.',
								'&nbsp;'
							) +
							currency.symbol_right,
					}}
				></span>
			</div>
			<div className="product-delete">
				<button type="button" onClick={() => doRemoveFromCart(product.cart_id)}>
					&times;
				</button>
			</div>
		</div>
	)
}
