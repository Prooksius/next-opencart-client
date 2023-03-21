import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { axiosInstance } from '../axiosInstance'
import {
	getCookie,
	setCookies,
	checkCookies,
	removeCookies,
} from 'cookies-next'
import { toastAlert } from 'config'
import { HYDRATE } from 'next-redux-wrapper'
import clonedeep from 'lodash.clonedeep'
import {
	TAddress,
	TCartProduct,
	TCartSelectedOptions,
	TCartTotal,
	TCurrentCartAction,
	TDelivery,
	TOptionType,
	TPayment,
	TRegion,
	TShoppingCart,
	TStatus,
	TUser,
} from 'types'
import type { RootState } from '@/store/store'
import { MyFormData } from '@/components/app/forms/formWrapper/types'
import { TProductOption } from './productsSlice'

interface TCartResponse {
	success: number
	cart: TShoppingCart
}

export interface CartState {
	products: TCartProduct[]
	total: number
	totals: TCartTotal[]
	total_str: string
	count: number
	weight: number
	weight_str: string
	stock: boolean
	shipping: boolean
	status: TStatus
	editStatus: TStatus
	editErrorMessage: string
	editError: string
	cartLoaded: boolean
	productParams: any[]
	deliveries: TDelivery[]
	currentDelivery: TCurrentCartAction
	payments: TPayment[]
	currentPayment: TCurrentCartAction
	paymentForm: any
	customerData: TUser
	customerAddress: TAddress | null
	regions: TRegion[]
	comment: string
}

const userDef: TUser = {
	id: 0,
	first_name: '',
	last_name: '',
	middle_name: '',
	email: '',
	phone: '',
	avatar: '',
	auth_key: '',
	error: false,
}

export const confirmOrder = createAsyncThunk(
	'/cart/confirmOrder',
	async ({ comment }: { comment: string }) => {
		const lang = getCookie('lang')
		const session_id = getCookie('session_id')
		const delivery = getCookie('delivery')
		const payment = getCookie('payment')
		console.log('payment', payment)
		const customer_data = getCookie('customer')
		const customer =
			typeof customer_data === 'string' ? JSON.parse(customer_data) : {}
		const address_data = getCookie('address')
		const address =
			typeof address_data === 'string' ? JSON.parse(address_data) : {}

		const bodyData = new FormData()
		bodyData.append('lang', typeof lang === 'string' ? lang : '')
		bodyData.append(
			'session_id',
			typeof session_id === 'string' ? session_id : ''
		)
		bodyData.append('delivery', typeof delivery === 'string' ? delivery : '')
		bodyData.append('payment', typeof payment === 'string' ? payment : '')
		bodyData.append('comment', comment)
		Object.keys(customer).map((key) => {
			bodyData.append('customer[' + key + ']', customer[key])
		})
		Object.keys(address).map((key) => {
			bodyData.append('address[' + key + ']', address[key])
		})

		const response = await axiosInstance.post('/cart/create-order', bodyData)
		console.log('response.data', response.data)
		return response.data
	}
)

export const fetchCart = createAsyncThunk('/cart/fetchCart', async () => {
	const lang = getCookie('lang')
	const session_id = getCookie('session_id')
	const delivery = getCookie('delivery')
	const payment = getCookie('payment')
	const customer_data = getCookie('customer')
	const customer =
		typeof customer_data === 'string' ? JSON.parse(customer_data) : {}
	const address_data = getCookie('address')
	const address =
		typeof address_data === 'string' ? JSON.parse(address_data) : {}

	const bodyData = new FormData()
	bodyData.append('lang', typeof lang === 'string' ? lang : '')
	bodyData.append(
		'session_id',
		typeof session_id === 'string' ? session_id : ''
	)
	bodyData.append('delivery', typeof delivery === 'string' ? delivery : '')
	bodyData.append('payment', typeof payment === 'string' ? payment : '')
	Object.keys(customer).map((key) => {
		bodyData.append('customer[' + key + ']', customer[key])
	})
	Object.keys(address).map((key) => {
		bodyData.append('address[' + key + ']', address[key])
	})

	const response = await axiosInstance.post<TCartResponse>('/cart', bodyData)
	console.log('response.data', response.data)
	return response.data
})

export const addToCart = createAsyncThunk(
	'cart/addToCart',
	async ({
		product_id,
		quantity,
		option,
	}: {
		product_id: number
		quantity: number
		option: TCartSelectedOptions
	}) => {
		const lang = getCookie('lang')
		const session_id = getCookie('session_id')
		const delivery = getCookie('delivery')
		const payment = getCookie('payment')

		const customer_data = getCookie('customer')
		console.log('customer_data', customer_data)
		const customer =
			typeof customer_data === 'string' ? JSON.parse(customer_data) : {}
		const address_data = getCookie('address')
		console.log('address_data', address_data)
		const address =
			typeof address_data === 'string' ? JSON.parse(address_data) : {}

		const bodyData = new FormData()
		bodyData.append('lang', typeof lang === 'string' ? lang : '')
		bodyData.append(
			'session_id',
			typeof session_id === 'string' ? session_id : ''
		)
		bodyData.append('delivery', typeof delivery === 'string' ? delivery : '')
		bodyData.append('payment', typeof payment === 'string' ? payment : '')
		bodyData.append('product_id', product_id.toString())
		bodyData.append('quantity', quantity.toString())
		Object.keys(customer).map((key) => {
			bodyData.append('customer[' + key + ']', customer[key])
		})
		Object.keys(address).map((key) => {
			bodyData.append('address[' + key + ']', address[key])
		})

    if (option) {
      Object.keys(option).map(optionId => {
        const value = option[parseInt(optionId)]
				if (typeof value === 'string' || typeof value === 'number') {
					bodyData.append('option[' + optionId + ']', value.toString())
        } else {
          console.log(value)
          value.map(item => {
						bodyData.append('option[' + optionId + '][]', item.toString())
          })
				}
      })
		}

		const response = await axiosInstance.post('/cart/add-to-cart', bodyData)
		console.log('response.data', response.data)
		return response.data
	}
)

export const updateCart = createAsyncThunk(
	'cart/updateCart',
	async ({ cart_id, quantity }: { cart_id: number; quantity: number }) => {
		const lang = getCookie('lang')
		const session_id = getCookie('session_id')
		const delivery = getCookie('delivery')
		const payment = getCookie('payment')
		const customer_data = getCookie('customer')
		const customer =
			typeof customer_data === 'string' ? JSON.parse(customer_data) : {}
		const address_data = getCookie('address')
		console.log('address_data', address_data)
		const address =
			typeof address_data === 'string' ? JSON.parse(address_data) : {}

		const bodyData = new FormData()
		bodyData.append('lang', typeof lang === 'string' ? lang : '')
		bodyData.append(
			'session_id',
			typeof session_id === 'string' ? session_id : ''
		)
		bodyData.append('delivery', typeof delivery === 'string' ? delivery : '')
		bodyData.append('payment', typeof payment === 'string' ? payment : '')
		bodyData.append('cart_id', cart_id.toString())
		bodyData.append('quantity', quantity.toString())
		Object.keys(customer).map((key) => {
			bodyData.append('customer[' + key + ']', customer[key])
		})
		Object.keys(address).map((key) => {
			bodyData.append('address[' + key + ']', address[key])
		})

		const response = await axiosInstance.post('/cart/update-cart', bodyData)
		console.log('response.data', response.data)
		return response.data
	}
)

export const removeFromCart = createAsyncThunk(
	'cart/removeFromCart',
	async (cart_id: number) => {
		const lang = getCookie('lang')
		const session_id = getCookie('session_id')
		const delivery = getCookie('delivery')
		const payment = getCookie('payment')
		const customer_data = getCookie('customer')
		const customer =
			typeof customer_data === 'string' ? JSON.parse(customer_data) : {}
		const address_data = getCookie('address')
		console.log('address_data', address_data)
		const address =
			typeof address_data === 'string' ? JSON.parse(address_data) : {}

		const bodyData = new FormData()
		bodyData.append('lang', typeof lang === 'string' ? lang : '')
		bodyData.append(
			'session_id',
			typeof session_id === 'string' ? session_id : ''
		)
		bodyData.append('delivery', typeof delivery === 'string' ? delivery : '')
		bodyData.append('payment', typeof payment === 'string' ? payment : '')
		bodyData.append('cart_id', cart_id.toString())
		Object.keys(customer).map((key) => {
			bodyData.append('customer[' + key + ']', customer[key])
		})
		Object.keys(address).map((key) => {
			bodyData.append('address[' + key + ']', address[key])
		})

		const response = await axiosInstance.post(
			'/cart/remove-from-cart',
			bodyData
		)
		console.log('response.data', response.data)
		return response.data
	}
)

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
	const lang = getCookie('lang')
	const session_id = getCookie('session_id')

	const bodyData = new FormData()
	bodyData.append('lang', typeof lang === 'string' ? lang : '')
	bodyData.append(
		'session_id',
		typeof session_id === 'string' ? session_id : ''
	)

	const response = await axiosInstance.post('/cart/clear-cart', bodyData)
	return response.data
})

const initialState: CartState = {
	products: [],
	total: 0,
	totals: [],
	total_str: '',
	count: 0,
	weight: 0,
	weight_str: '',
	stock: true,
	shipping: false,
	status: 'idle',
	editStatus: 'idle',
	editErrorMessage: '',
	editError: '',
	cartLoaded: false,
	productParams: [],
	deliveries: [],
	currentDelivery: {
		code: '',
		error: false,
	},
	payments: [],
	currentPayment: {
		code: '',
		error: false,
	},
	paymentForm: null,
	customerData: userDef,
	customerAddress: null,
	regions: [],
	comment: '',
}

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCart: (state, action: PayloadAction<TShoppingCart>) => {
			state.products = action.payload.products

			state.productParams = state.products.map((item) => {
				return {
					cart_id: item.cart_id,
					price: item.price,
					quantity: item.quantity,
					total: item.total,
					updated: false,
					updatedCount: 0,
				}
			})

			state.total = action.payload.total
			state.totals = action.payload.totals
			state.deliveries = action.payload.deliveries
			state.currentDelivery = action.payload.current_delivery
			state.payments = action.payload.payments
			state.currentPayment = action.payload.current_payment
			state.total_str = action.payload.total_str
			state.count = action.payload.count
			state.weight = action.payload.weight
			state.weight_str = action.payload.weight_str
			state.stock = action.payload.stock
			state.shipping = action.payload.shipping
			state.status = 'succeeded'
			state.cartLoaded = true
			state.editStatus = 'idle'
			state.editError = ''
			state.editErrorMessage = ''
			state.customerData = action.payload.customer_data
			state.customerAddress = action.payload.customer_address

			console.log(
				'action.payload.cart.customer_data',
				action.payload.customer_data
			)
		},
		setQuantity: (
			state,
			action: PayloadAction<{ cart_id: number; quantity: number }>
		) => {
			const found = state.productParams.find(
				(item) => +item.cart_id === +action.payload.cart_id
			)
			if (found && +action.payload.quantity !== +found.quantity) {
				found.quantity = +action.payload.quantity
				found.updated = true
				found.updatedCount += 1
			}
		},
		setCurrentDelivery: (state, action: PayloadAction<string>) => {
			state.currentDelivery = {
				code: action.payload,
				error: action.payload !== '',
			}
			if (typeof window !== 'undefined') {
				if (checkCookies('delivery')) removeCookies('delivery')
				setCookies('delivery', action.payload, { sameSite: 'none' })
			}
		},
		setCurrentPayment: (state, action: PayloadAction<string>) => {
			state.currentPayment = {
				code: action.payload,
				error: action.payload !== '',
			}
			if (typeof window !== 'undefined') {
				if (checkCookies('payment')) removeCookies('payment')
				setCookies('payment', action.payload, { sameSite: 'none' })
			}
		},
		setCustomerData: (state, { payload }: { payload: MyFormData }) => {
			state.customerData = userDef
			if (payload.fields) {
				Object.keys(payload.fields).map((key) => {
					if (payload.fields) {
						state.customerData[key] = payload.fields[key].value
					}
				})
			}
			state.customerData.error = !Object.entries(
				payload.fields ? payload.fields : {}
			).every(([key, value]) => value.errorMessage === '')

			if (typeof window !== 'undefined') {
				if (checkCookies('customer')) removeCookies('customer')
				setCookies('customer', state.customerData, { sameSite: 'none' })
			}
		},
		setCustomerAddress: (state, { payload }: { payload: TAddress }) => {
			state.customerAddress = payload
			const curRegion = state.customerAddress.region.split(', ')[0].trim()
			const foundRegion = state.regions.find((item) => item.name === curRegion)
			if (foundRegion) {
				state.customerAddress.regionCode = foundRegion.code
			}

			if (typeof window !== 'undefined') {
				if (checkCookies('address')) removeCookies('address')
				setCookies('address', state.customerAddress, { sameSite: 'none' })
			}
		},
		setAddressRegions: (state, action: PayloadAction<TRegion[]>) => {
			state.regions = action.payload
		},
		setCustomerComment: (state, action: PayloadAction<string>) => {
			state.comment = action.payload
		},
		purgeCart: (state) => {
			state.products = initialState.products
			state.productParams = initialState.productParams
			state.total = initialState.total
			state.totals = initialState.totals
			state.deliveries = initialState.deliveries
			state.currentDelivery = initialState.currentDelivery
			state.payments = initialState.payments
			state.currentPayment = initialState.currentPayment
			state.total_str = initialState.total_str
			state.count = initialState.count
			state.weight = initialState.weight
			state.weight_str = initialState.weight_str
			state.stock = initialState.stock
			state.shipping = initialState.shipping
			state.status = initialState.status
			state.cartLoaded = initialState.cartLoaded
			state.editStatus = initialState.editStatus
			state.editError = initialState.editError
			state.editErrorMessage = initialState.editErrorMessage
			state.regions = initialState.regions
		},
	},
	extraReducers(builder) {
		builder
			.addCase(HYDRATE, (state, action: any) => {
				state.products = action.payload.cart.products

				state.productParams = state.products.map((item) => {
					return {
						cart_id: item.cart_id,
						price: item.price,
						quantity: item.quantity,
						total: item.total,
						updated: false,
						updatedCount: 0,
					}
				})

				state.total = action.payload.cart.total
				state.totals = action.payload.cart.totals
				state.deliveries = action.payload.cart.deliveries
				state.currentDelivery = action.payload.cart.currentDelivery
				state.payments = action.payload.cart.payments
				state.currentPayment = action.payload.cart.currentPayment
				state.total_str = action.payload.cart.total_str
				state.count = action.payload.cart.count
				state.weight = action.payload.cart.weight
				state.weight_str = action.payload.cart.weight_str
				state.stock = action.payload.cart.stock
				state.shipping = action.payload.cart.shipping
				state.customerData = action.payload.cart.customerData
				state.customerAddress = action.payload.cart.customerAddress
				state.status = 'succeeded'
				state.cartLoaded = true
				state.editStatus = 'idle'
				state.editError = ''
				state.editErrorMessage = ''
				state.regions = action.payload.cart.regions
			})
			.addCase(fetchCart.pending, (state, action) => {
				state.status = 'loading'
			})
			.addCase(fetchCart.fulfilled, (state, action) => {
				state.products = action.payload.cart.products

				state.productParams = state.productParams.filter((item) =>
					state.products
						.map((product) => product.cart_id)
						.includes(item.cart_id)
				)
				state.productParams = state.productParams.map((item) => {
					return {
						cart_id: item.cart_id,
						price: item.price,
						quantity: item.quantity,
						total: item.total,
						updated: false,
						updatedCount: item.updatedCount,
					}
				})

				state.total = action.payload.cart.total
				state.totals = action.payload.cart.totals
				state.deliveries = action.payload.cart.deliveries
				state.currentDelivery = action.payload.cart.current_delivery
				state.payments = action.payload.cart.payments
				state.currentPayment = action.payload.cart.current_payment
				state.total_str = action.payload.cart.total_str
				state.count = action.payload.cart.count
				state.weight = action.payload.cart.weight
				state.weight_str = action.payload.cart.weight_str
				state.stock = action.payload.cart.stock
				state.shipping = action.payload.cart.shipping
				state.status = 'succeeded'
				state.cartLoaded = true
				state.editStatus = 'idle'
				state.editError = ''
				state.editErrorMessage = ''
			})
			.addCase(fetchCart.rejected, (state, action) => {
				state.status = 'failed'
				throw new Error(action.error.message)
			})
			.addCase(confirmOrder.pending, (state) => {
				state.status = 'loading'
			})
			.addCase(confirmOrder.fulfilled, (state, action) => {
				state.products = action.payload.cart.products

				state.productParams = state.productParams.filter((item) =>
					state.products
						.map((product) => product.cart_id)
						.includes(item.cart_id)
				)
				state.productParams = state.productParams.map((item) => {
					return {
						cart_id: item.cart_id,
						price: item.price,
						quantity: item.quantity,
						total: item.total,
						updated: false,
						updatedCount: item.updatedCount,
					}
				})

				state.total = action.payload.cart.total
				state.totals = action.payload.cart.totals
				state.deliveries = action.payload.cart.deliveries
				state.currentDelivery = action.payload.cart.current_delivery
				state.payments = action.payload.cart.payments
				state.currentPayment = action.payload.cart.current_payment
				state.total_str = action.payload.cart.total_str
				state.count = action.payload.cart.count
				state.weight = action.payload.cart.weight
				state.weight_str = action.payload.cart.weight_str
				state.stock = action.payload.cart.stock
				state.shipping = action.payload.cart.shipping
				state.status = 'succeeded'
				state.cartLoaded = true
				state.editStatus = 'idle'
				state.editError = ''
				state.editErrorMessage = ''

				state.paymentForm = clonedeep(action.payload.payment_data)
				state.paymentForm.order_id = action.payload.order_id
			})
			.addCase(confirmOrder.rejected, (state, action) => {
				state.status = 'failed'
				throw new Error(action.error.message)
			})
			.addCase(addToCart.pending, (state, action) => {
				state.editStatus = 'loading'
			})
			.addCase(addToCart.fulfilled, (state, action) => {
				if (action.payload.result === 'success') {
					state.products = action.payload.cart.products

					state.productParams = state.productParams.filter((item) =>
						state.products
							.map((product) => product.cart_id)
							.includes(item.cart_id)
					)
					state.products.map((product) => {
						const found = state.productParams.find(
							(item) => +item.cart_id === +product.cart_id
						)
						if (found) {
							found.quantity = product.quantity
							found.updated = false
						} else {
							state.productParams.push({
								cart_id: product.cart_id,
								price: product.price,
								quantity: product.quantity,
								total: product.total,
								updated: false,
								updatedCount: 0,
							})
						}
					})

					state.total = action.payload.cart.total
					state.totals = action.payload.cart.totals
					state.deliveries = action.payload.cart.deliveries
					state.currentDelivery = action.payload.cart.current_delivery
					state.payments = action.payload.cart.payments
					state.currentPayment = action.payload.cart.current_payment
					state.total_str = action.payload.cart.total_str
					state.count = action.payload.cart.count
					state.weight = action.payload.cart.weight
					state.weight_str = action.payload.cart.weight_str
					state.stock = action.payload.cart.stock
					state.shipping = action.payload.cart.shipping
					state.status = 'succeeded'
					state.cartLoaded = true
					state.editStatus = 'succeeded'
					state.editError = ''
					state.editErrorMessage = ''
					toastAlert(action.payload.message, 'success')
				} else {
					console.log('action.payload', action.payload)
					state.editStatus = 'failed'
					state.editError = action.payload.cart.error
					state.editErrorMessage = action.payload.error
					toastAlert(action.payload.cart.message, 'error')
				}
			})
			.addCase(addToCart.rejected, (state, action) => {
				state.editStatus = 'failed'
				//state.editError = action.payload.cart.error
				//state.editErrorMessage = action.payload.error
				throw new Error(action.error.message)
			})
			.addCase(updateCart.pending, (state, action) => {
				state.editStatus = 'loading'
			})
			.addCase(updateCart.fulfilled, (state, action) => {
				state.products = action.payload.cart.products

				state.productParams = state.productParams.filter((item) =>
					state.products
						.map((product) => product.cart_id)
						.includes(item.cart_id)
				)
				state.products.map((product) => {
					const found =
						state.productParams &&
						state.productParams.find(
							(item) => +item.cart_id === +product.cart_id
						)
					if (found) {
						found.quantity = product.quantity
						found.updated = false
					} else {
						state.productParams.push({
							cart_id: product.cart_id,
							price: product.price,
							quantity: product.quantity,
							total: product.total,
							updated: false,
							updatedCount: 0,
						})
					}
				})

				state.total = action.payload.cart.total
				state.totals = action.payload.cart.totals
				state.deliveries = action.payload.cart.deliveries
				state.currentDelivery = action.payload.cart.current_delivery
				state.payments = action.payload.cart.payments
				state.currentPayment = action.payload.cart.current_payment
				state.total_str = action.payload.cart.total_str
				state.count = action.payload.cart.count
				state.weight = action.payload.cart.weight
				state.weight_str = action.payload.cart.weight_str
				state.stock = action.payload.cart.stock
				state.shipping = action.payload.cart.shipping
				state.status = 'succeeded'
				state.cartLoaded = true
				state.editStatus = 'succeeded'
				state.editError = ''
				state.editErrorMessage = ''
			})
			.addCase(updateCart.rejected, (state, action) => {
				state.editStatus = 'failed'
				state.editError = action.error.message ? action.error.message : ''
				state.editErrorMessage = action.error.message
					? action.error.message
					: ''
				throw new Error(action.error.message)
			})
			.addCase(removeFromCart.pending, (state, action) => {
				state.editStatus = 'loading'
			})
			.addCase(removeFromCart.fulfilled, (state, action) => {
				state.products = action.payload.cart.products
				state.productParams = state.productParams.filter((item) =>
					state.products
						.map((product) => product.cart_id)
						.includes(item.cart_id)
				)
				state.total = action.payload.cart.total
				state.totals = action.payload.cart.totals
				state.deliveries = action.payload.cart.deliveries
				state.currentDelivery = action.payload.cart.current_delivery
				state.payments = action.payload.cart.payments
				state.currentPayment = action.payload.cart.current_payment
				state.total_str = action.payload.cart.total_str
				state.count = action.payload.cart.count
				state.weight = action.payload.cart.weight
				state.weight_str = action.payload.cart.weight_str
				state.stock = action.payload.cart.stock
				state.shipping = action.payload.cart.shipping
				state.status = 'succeeded'
				state.cartLoaded = true
				state.editStatus = 'succeeded'
				state.editError = ''
				state.editErrorMessage = ''
			})
			.addCase(removeFromCart.rejected, (state, action) => {
				state.editStatus = 'failed'
				state.editError = action.error.message ? action.error.message : ''
				state.editErrorMessage = action.error.message
					? action.error.message
					: ''
				throw new Error(action.error.message)
			})
			.addCase(clearCart.pending, (state, action) => {
				state.editStatus = 'loading'
			})
			.addCase(clearCart.fulfilled, (state, action) => {
				state.products = action.payload.cart.products
				state.total = action.payload.cart.total
				state.totals = action.payload.cart.totals
				state.deliveries = action.payload.cart.deliveries
				state.currentDelivery = action.payload.cart.current_delivery
				state.payments = action.payload.cart.payments
				state.currentPayment = action.payload.cart.current_payment
				state.total_str = action.payload.cart.total_str
				state.count = action.payload.cart.count
				state.weight = action.payload.cart.weight
				state.weight_str = action.payload.cart.weight_str
				state.stock = action.payload.cart.stock
				state.shipping = action.payload.cart.shipping
				state.status = 'succeeded'
				state.cartLoaded = true
				state.editStatus = 'succeeded'
				state.editError = ''
				state.editErrorMessage = ''
			})
			.addCase(clearCart.rejected, (state, action) => {
				state.editStatus = 'failed'
				state.editErrorMessage = action.error.message
					? action.error.message
					: ''
				throw new Error(action.error.message)
			})
	},
})

// Action creators are generated for each case reducer function
export const {
	setCart,
	purgeCart,
	setQuantity,
	setCurrentDelivery,
	setCurrentPayment,
	setCustomerData,
	setCustomerAddress,
	setAddressRegions,
	setCustomerComment,
} = cartSlice.actions

export default cartSlice.reducer

export const listCartProducts = (state: RootState) => state.cart.products
export const listCartProductsCount = (state: RootState) => state.cart.count
export const listCartStatus = (state: RootState) => state.cart.status
export const listCartEditStatus = (state: RootState) => state.cart.editStatus
export const listCartLoaded = (state: RootState) => state.cart.cartLoaded
export const listCartItemsCount = (state: RootState) => state.cart.count
export const listCartTotalNum = (state: RootState) => state.cart.total
export const listCartTotal = (state: RootState) => state.cart.total_str
export const listCartTotals = (state: RootState) => state.cart.totals
export const listCartDeliveries = (state: RootState) => state.cart.deliveries
export const listCurrentDelivery = (state: RootState) =>
	state.cart.currentDelivery
export const listCartPayments = (state: RootState) => state.cart.payments
export const listCurrentPayment = (state: RootState) =>
	state.cart.currentPayment
export const listCustomerData = (state: RootState) => state.cart.customerData
export const listCustomerAddress = (state: RootState) =>
	state.cart.customerAddress
export const listCustomerComment = (state: RootState) => state.cart.comment
export const listCartWeight = (state: RootState) => state.cart.weight_str
export const listCartStock = (state: RootState) => state.cart.stock
export const listCartShipping = (state: RootState) => state.cart.shipping
export const listAddressRegions = (state: RootState) => state.cart.regions
export const listCartEditErrorMessage = (state: RootState) =>
	state.cart.editErrorMessage
export const getUpdatedCount = (state: RootState) =>
	state.cart.productParams.reduce((prev, cur) => prev + cur.updatedCount, 0)
export const listUpdated = (state: RootState) =>
	state.cart.productParams &&
	state.cart.productParams.filter((item) => item.updated)
export const listQuantity = (state: RootState) => (cartID: number) =>
	state.cart.productParams &&
	state.cart.productParams.find((item) => +item.cart_id === +cartID).quantity
export const listProductTotal = (state: RootState) => (cartID: number) =>
	state.cart.productParams &&
	state.cart.productParams.find((item) => +item.cart_id === +cartID).total
export const selectItemById = (state: RootState, cartId: number) => {
	return state.cart.products.find((item) => item.cart_id === cartId)
}
