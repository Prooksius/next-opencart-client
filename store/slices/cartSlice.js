import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
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
//import type { RootState } from "../store"
/*
interface CartRecord {
  id?: number
  title: string
  date?: number
  completed?: number
  datetext?: string
}

interface CartState {
  allList: CartRecord[]
  list: CartRecord[]
  page: number
  itemsCount: number
  allStatus: string
  status: string
  editStatus: string
  notesLoaded: boolean
  error: string | null
}

interface CartPageRequestProps {
  page: number
  sort: string
  order: string
  itemsInPage: number
  completed: number | null
}
*/
export const confirmOrder = createAsyncThunk(
	'/cart/confirmOrder',
	async ({ comment }) => {
		const lang = getCookie('lang')
		const session_id = getCookie('session_id')
		const delivery = getCookie('delivery')
		const payment = getCookie('payment')
		console.log('payment', payment)
		const customer_data = getCookie('customer')
		const customer = customer_data ? JSON.parse(customer_data) : {}
		const address_data = getCookie('address')
		const address = address_data ? JSON.parse(address_data) : {}

		const bodyData = new FormData()
		bodyData.append('lang', lang)
		bodyData.append('session_id', session_id)
		bodyData.append('delivery', delivery ? delivery : '')
		bodyData.append('payment', payment ? payment : '')
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
	const customer = customer_data ? JSON.parse(customer_data) : {}
	const address_data = getCookie('address')
	const address = address_data ? JSON.parse(address_data) : {}

	const bodyData = new FormData()
	bodyData.append('lang', lang)
	bodyData.append('session_id', session_id)
	bodyData.append('delivery', delivery ? delivery : '')
	bodyData.append('payment', payment ? payment : '')
	Object.keys(customer).map((key) => {
		bodyData.append('customer[' + key + ']', customer[key])
	})
	Object.keys(address).map((key) => {
		bodyData.append('address[' + key + ']', address[key])
	})

	const response = await axiosInstance.post('/cart', bodyData)
	console.log('response.data', response.data)
	return response.data
})

export const addToCart = createAsyncThunk(
	'cart/addToCart',
	async ({ product_id, quantity, option }) => {
		const lang = getCookie('lang')
		const session_id = getCookie('session_id')
		const delivery = getCookie('delivery')
		const payment = getCookie('payment')

		const customer_data = getCookie('customer')
		console.log('customer_data', customer_data)
		const customer = customer_data ? JSON.parse(customer_data) : {}
		const address_data = getCookie('address')
		console.log('address_data', address_data)
		const address = address_data ? JSON.parse(address_data) : {}

		const bodyData = new FormData()
		bodyData.append('lang', lang)
		bodyData.append('session_id', session_id)
		bodyData.append('product_id', product_id)
		bodyData.append('quantity', quantity)
		bodyData.append('delivery', delivery ? delivery : '')
		bodyData.append('payment', payment ? payment : '')
		Object.keys(customer).map((key) => {
			bodyData.append('customer[' + key + ']', customer[key])
		})
		Object.keys(address).map((key) => {
			bodyData.append('address[' + key + ']', address[key])
		})

		if (option) {
			for (var optionId in option) {
				if (typeof option[optionId] === 'object') {
					for (var optionValueId in option[optionId]) {
						bodyData.append(
							'option[' + optionId + '][]',
							option[optionId][optionValueId]
						)
					}
				} else {
					bodyData.append('option[' + optionId + ']', option[optionId])
				}
			}
		}

		const response = await axiosInstance.post('/cart/add-to-cart', bodyData)
		console.log('response.data', response.data)
		return response.data
	}
)

export const updateCart = createAsyncThunk(
	'cart/updateCart',
	async ({ cart_id, quantity }) => {
		const lang = getCookie('lang')
		const session_id = getCookie('session_id')
		const delivery = getCookie('delivery')
		const payment = getCookie('payment')
		const customer_data = getCookie('customer')
		const customer = customer_data ? JSON.parse(customer_data) : {}
		const address_data = getCookie('address')
		const address = address_data ? JSON.parse(address_data) : {}

		const bodyData = new FormData()
		bodyData.append('lang', lang)
		bodyData.append('session_id', session_id)
		bodyData.append('cart_id', cart_id)
		bodyData.append('quantity', quantity)
		bodyData.append('delivery', delivery ? delivery : '')
		bodyData.append('payment', payment ? payment : '')
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
	async (cart_id) => {
		const lang = getCookie('lang')
		const session_id = getCookie('session_id')
		const delivery = getCookie('delivery')
		const payment = getCookie('payment')
		const customer_data = getCookie('customer')
		const customer = customer_data ? JSON.parse(customer_data) : {}
		const address_data = getCookie('address')
		const address = address_data ? JSON.parse(address_data) : {}

		const bodyData = new FormData()
		bodyData.append('lang', lang)
		bodyData.append('session_id', session_id)
		bodyData.append('cart_id', cart_id)
		bodyData.append('delivery', delivery ? delivery : '')
		bodyData.append('payment', payment ? payment : '')
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
	bodyData.append('lang', lang)
	bodyData.append('session_id', session_id)

	const response = await axiosInstance.post('/cart/clear-cart', bodyData)
	return response.data
})

const initialState = {
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
	editError: null,
	cartLoaded: false,
	productParams: [],
	deliveries: [],
	currentDelivery: {},
	payments: [],
	currentPayment: {},
	paymentForm: null,
	customerData: {},
	customerAddress: null,
	regions: [],
	comment: '',
}

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCart: (state, action) => {
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
			state.editError = null
			state.editErrorMessage = ''
			state.customerData = action.payload.cart.customer_data
			state.customerAddress = action.payload.cart.customer_address

			console.log(
				'action.payload.cart.customer_data',
				action.payload.cart.customer_data
			)
		},
		setQuantity: (state, action) => {
			const found = state.productParams.find(
				(item) => +item.cart_id === +action.payload.cart_id
			)
			if (found && +action.payload.quantity !== +found.quantity) {
				found.quantity = +action.payload.quantity
				found.updated = true
				found.updatedCount += 1
			}
		},
		setCurrentDelivery: (state, action) => {
			state.currentDelivery = {
				code: action.payload,
				error: action.payload !== '',
			}
			if (typeof window !== 'undefined') {
				if (checkCookies('delivery')) removeCookies('delivery')
				setCookies('delivery', action.payload, { sameSite: 'None' })
			}
		},
		setCurrentPayment: (state, action) => {
			state.currentPayment = {
				code: action.payload,
				error: action.payload !== '',
			}
			if (typeof window !== 'undefined') {
				if (checkCookies('payment')) removeCookies('payment')
				setCookies('payment', action.payload, { sameSite: 'None' })
			}
		},
		setCustomerData: (state, action) => {
			state.customerData = {}
			Object.keys(action.payload).map((key) => {
				state.customerData[key] = action.payload[key].value
			})
			state.customerData.error = !Object.entries(action.payload).every(
				([key, value]) => value.errorMessage === ''
			)

			if (typeof window !== 'undefined') {
				if (checkCookies('customer')) removeCookies('customer')
				setCookies('customer', state.customerData, { sameSite: 'None' })
			}
		},
		setCustomerAddress: (state, action) => {
			state.customerAddress = action.payload
			const curRegion = state.customerAddress.region.split(', ')[0].trim()
			const foundRegion = state.regions.find((item) => item.name === curRegion)
			if (foundRegion) {
				state.customerAddress.regionCode = foundRegion.code
			}

			if (typeof window !== 'undefined') {
				if (checkCookies('address')) removeCookies('address')
				setCookies('address', state.customerAddress, { sameSite: 'None' })
			}
		},
		setAddressRegions: (state, action) => {
			state.regions = action.payload
		},
		setCustomerComment: (state, action) => {
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
			.addCase(HYDRATE, (state, action) => {
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
				state.editError = null
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
				state.editError = null
				state.editErrorMessage = ''
			})
			.addCase(fetchCart.rejected, (state, action) => {
				state.status = 'failed'
				throw new Error(action.error.message)
			})
			.addCase(confirmOrder.pending, (state, action) => {
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
				state.editError = null
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
					state.editError = null
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
				state.editStatus = 'succeeded'
				state.editError = null
				state.editErrorMessage = ''
			})
			.addCase(updateCart.rejected, (state, action) => {
				state.editStatus = 'failed'
				state.editError = action.payload.cart.error
				state.editErrorMessage = action.payload.error
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
				state.editError = null
				state.editErrorMessage = ''
			})
			.addCase(removeFromCart.rejected, (state, action) => {
				state.editStatus = 'failed'
				state.editError = action.payload.cart.error
				state.editErrorMessage = action.payload.error
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
				state.editError = null
				state.editErrorMessage = ''
			})
			.addCase(clearCart.rejected, (state, action) => {
				state.editStatus = 'failed'
				state.editErrorMessage = action.payload.error
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

export const listCartProducts = (state) => state.cart.products
export const listCartProductsCount = (state) => state.cart.count
export const listCartStatus = (state) => state.cart.status
export const listCartEditStatus = (state) => state.cart.editStatus
export const listCartLoaded = (state) => state.cart.cartLoaded
export const listCartItemsCount = (state) => state.cart.count
export const listCartTotalNum = (state) => state.cart.total
export const listCartTotal = (state) => state.cart.total_str
export const listCartTotals = (state) => state.cart.totals
export const listCartDeliveries = (state) => state.cart.deliveries
export const listCurrentDelivery = (state) => state.cart.currentDelivery
export const listCartPayments = (state) => state.cart.payments
export const listCurrentPayment = (state) => state.cart.currentPayment
export const listCustomerData = (state) => state.cart.customerData
export const listCustomerAddress = (state) => state.cart.customerAddress
export const listCustomerComment = (state) => state.cart.comment
export const listCartWeight = (state) => state.cart.weight_str
export const listCartStock = (state) => state.cart.stock
export const listCartShipping = (state) => state.cart.shipping
export const listAddressRegions = (state) => state.cart.regions
export const listCartEditErrorMessage = (state) => state.cart.editErrorMessage
export const getUpdatedCount = (state) =>
	state.cart.productParams.reduce((prev, cur) => prev + cur.updatedCount, 0)
export const listUpdated = (state) =>
	state.cart.productParams.filter((item) => item.updated)
export const listQuantity = (state) => (cartID) =>
	state.cart.productParams.find((item) => +item.cart_id === +cartID).quantity
export const listProductTotal = (state) => (cartID) =>
	state.cart.productParams.find((item) => +item.cart_id === +cartID).total

export const selectItemById = (state, cartId) => {
	return state.cart.products.find((item) => item.cart_id === cartId)
}
