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
	listUpdated,
	getUpdatedCount,
	updateCart,
	setQuantity,
	removeFromCart,
} from '@/store/slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import gsap from 'gsap'
import debounce from 'lodash.debounce'
import { numberFormat } from 'config'
import { QuantitySelector } from '@/components/app/misc/QuantitySelector'
import Link from 'next/link'

export const HeaderCart = () => {
	const dispatch = useDispatch()
	const translations = useSelector(listTranslations)
	const currency = useSelector(listCurrency)
	const cartProducts = useSelector(listCartProducts)
	const cartCount = useSelector(listCartProductsCount)
	const cartTotalNum = useSelector(listCartTotalNum)
	const editStatus = useSelector(listCartEditStatus)
	const updatedCount = useSelector(getUpdatedCount)
	const updatedList = useSelector(listUpdated)
	const selQuantity = useSelector(listQuantity)

	const [cartTotal, setCartTotal] = useState(cartTotalNum)

	const doUpdateCart = (cart_id, quantity) => {
		dispatch(updateCart({ cart_id, quantity }))
	}

	const doRemoveFromCart = (cart_id) => {
		dispatch(removeFromCart(cart_id))
	}

	const batchUpdateQuantity = () => {
		updatedList.map((item) => {
			doUpdateCart(item.cart_id, item.quantity)
		})
	}

	// eslint-disable-next-line
	const debouncedUpdateQuantity = debounce(() => batchUpdateQuantity(), 500)

	useEffect(() => {
		debouncedUpdateQuantity()
		return debouncedUpdateQuantity.cancel
		// eslint-disable-next-line
	}, [updatedCount])

	useEffect(() => {
		if (cartTotal !== cartTotalNum) {
			const cartCost = { value: cartTotal, endValue: cartTotalNum }

			gsap.to(cartCost, {
				value: cartCost.endValue,
				duration: 0.5,
				onUpdate: () => {
					setCartTotal(cartCost.value)
				},
			})
		}
		// eslint-disable-next-line
	}, [cartTotalNum])

	return (
		<div className="cart-header" id="cart-header">
			<Image
				src={REACT_APP_IMAGE_URL + '/upload/image/icons/shopping-cart.svg'}
				alt="cart"
				width="24px"
				height="24px"
			/>
			{cartCount > 0 && (
				<div className="cart-header__cart-count">{cartCount}</div>
			)}
			<div className="cart-header__dropdown">
				{cartProducts.length === 0 && (
					<p style={{ marginTop: '10px' }}>{translations('CartIsEmpty')}</p>
				)}
				{cartProducts.length > 0 && (
					<div className="cart-header__products">
						{cartProducts.map((product) => (
							<div className="cart-header__product" key={product.cart_id}>
								<div className="product-thumb">
									<Image
										src={REACT_APP_IMAGE_URL + product.thumb}
										alt="cart"
										width="70px"
										height="70px"
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
									<span
										dangerouslySetInnerHTML={{
											__html: '&nbsp;' + product.price_str,
										}}
									></span>
									<QuantitySelector
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
								<div className="product-delete">
									<button
										type="button"
										onClick={() => doRemoveFromCart(product.cart_id)}
									>
										&times;
									</button>
								</div>
							</div>
						))}
					</div>
				)}
				{cartProducts.length !== 0 && (
					<div className="header-cart__totals">
						{translations('CartTotal')}:{' '}
						<b
							dangerouslySetInnerHTML={{
								__html:
									'&nbsp;' +
									currency.symbol_left +
									numberFormat(cartTotal, currency.decimal_place, '.', ' ') +
									currency.symbol_right,
							}}
						></b>
						<Link href="/checkout">
							<a className="btn btn-blue">{translations('CartGoToCartPage')}</a>
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}
