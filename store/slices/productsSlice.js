import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../axiosInstance'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { PRODUCTS_LIMIT, serializeObj, optionsWithValue } from 'config'
import { HYDRATE } from 'next-redux-wrapper'

//import type { RootState } from "../store"
/*
interface ProductsRecord {
	id: number
	name: string
	description: string
	model: string
	sku: string
}

interface ProductsState {
	list: ProductsRecord[]
	page: number
	itemsCount: number
	status: string
	loaded: boolean
	error: string | null
}

interface ProductsPageRequestProps {
	page: number
	sort?: string
	order?: string
	itemsInPage: number
	payed: number | null
}
*/

const initialState = {
	list: [],
	page: 1,
	filtersChanged: false,
	itemsCount: 0,
	sortOrder: 'default',
	itemsInPage: PRODUCTS_LIMIT,
	viewType: 'grid3',
	status: 'idle',
	editStatus: 'idle',
	loaded: false,
	error: null,
	clonedImage: null,
	cartProductId: null,
	showProductOptions: false,
	showProductOptionsId: 0,
	options: [],
	optionsUpdated: false,
	quantity: 0,
	pageOptions: [],
	pageOptionsUpdated: false,
	pageQuantity: 0,
	pageImageIndex: 0,
	headerSearchList: [],
	headerSearchStatus: 'idle',
}

export const fetchProductsPage = createAsyncThunk(
	'products/fetchProductsPage',
	async ({ query }, { dispatch, getState }) => {
		console.log('dispatch', dispatch)
		const lang = getCookie('lang')
		const bodyData = new FormData()
		bodyData.append('lang', lang)

		const response = await axiosInstance.post(
			'/product/page?' + serializeObj(query),
			bodyData
		)

		console.log('response.data', response.data)
		return response.data
	}
)

export const lookupProducts = createAsyncThunk(
	'products/lookupProducts',
	async ({ query }) => {
		const lang = getCookie('lang')
		const bodyData = new FormData()
		bodyData.append('lang', lang)

		const response = await axiosInstance.post(
			//'/product/lookup?' + serializeObj(query),
			'/product/page?' + serializeObj(query),
			bodyData
		)

		console.log('lookup response.data', response.data)
		return response.data
	}
)

export const editProduct = createAsyncThunk(
	'product/editProduct',
	async (editedProduct) => {
		const lang = getCookie('lang')
		const bodyData = new FormData()
		bodyData.append('name', editedProduct.name.value)
		bodyData.append('description', editedProduct.description.value)
		bodyData.append('model', editedProduct.model.value)
		bodyData.append('sku', editedProduct.sku.value)
		bodyData.append('token', editedProduct.token)
		bodyData.append('lang', lang)

		const response = await axiosInstance.post(
			'/product/edit-product?id=' + editedProduct.id,
			bodyData
		)
		return response.data
	}
)
export const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
		setProducts: (state, action) => {
			state.list = action.payload.products.list
			state.itemsCount = action.payload.products.count
			state.viewType = action.payload.serverViewType || 'grid3'
			state.status = 'succeeded'
			state.loaded = true
		},
		clearProducts: (state) => {
			state.list = initialState.list
			state.itemsCount = initialState.count
			state.status = initialState.status
			state.viewType = initialState.viewType
			state.loaded = initialState.loaded
			state.error = initialState.error
			state.filtersChanged = initialState.filtersChanged
		},
		setProductViewType: (state, action) => {
			state.viewType = action.payload
		},
		setProductIimagesItem: (state, action) => {
			const found = state.list.find((item) => +item.id === action.payload.id)
			if (found) {
				found.image_item = action.payload.index
			}
		},
		setPageImageIndex: (state, action) => {
			state.pageImageIndex = action.payload
		},
		setClonedImage: (state, action) => {
			state.clonedImage = action.payload
		},
		clearClonedImage: (state) => {
			state.clonedImage = null
		},
		clearHeaderSearch: (state) => {
			state.headerSearchList = []
			state.headerSearchStatus = 'idle'
		},
		setCartProductId: (state, action) => {
			state.cartProductId = action.payload
		},
		clearCartProductId: (state) => {
			state.cartProductId = null
		},
		setShowProductOptions: (state) => {
			state.showProductOptions = true
		},
		clearShowProductOptions: (state) => {
			state.showProductOptions = false
		},
		setQuantity: (state, action) => {
			if (action.payload.page) {
				state.pageQuantity = action.payload.quantity
			} else {
				state.quantity = action.payload.quantity
			}
		},
		setOptionsUpdated: (state, action) => {
			if (action.payload.page) {
				state.pageOptionsUpdated = true
			} else {
				state.optionsUpdated = true
			}
		},
		clearOptionsUpdated: (state, action) => {
			if (action.payload.page) {
				state.pageOptionsUpdated = false
			} else {
				state.optionsUpdated = false
			}
		},
		setShowProductOptionsId: (state, action) => {
			state.showProductOptionsId = action.payload
		},
		clearShowProductOptionsId: (state) => {
			state.showProductOptionsId = 0
		},
		assignProductOption: (state, action) => {
			if (action.payload.page) {
				state.pageOptions = action.payload.options
			} else {
				state.options = action.payload.options
			}
		},
		setProductOption: (state, action) => {
			const optionFound = null
			if (action.payload.page) {
				optionFound = state.pageOptions.find(
					(option) =>
						+option.product_option_id === +action.payload.product_option_id
				)
			} else {
				optionFound = state.options.find(
					(option) =>
						+option.product_option_id === +action.payload.product_option_id
				)
			}
			if (optionFound) {
				console.log('option found')
				if (optionsWithValue.includes(optionFound.type)) {
					optionFound.value = action.payload.value
				} else if (optionFound.type === 'radio') {
					optionFound.product_option_value.map((value) => {
						if (
							+value.product_option_value_id ===
							+action.payload.product_option_value_id
						) {
							value.is_selected = true
							optionFound.error = ''
						} else {
							value.is_selected = false
						}
					})
				} else if (optionFound.type === 'checkbox') {
					optionFound.product_option_value.map((value) => {
						if (
							+value.product_option_value_id ===
							+action.payload.product_option_value_id
						) {
							value.is_selected = !value.is_selected
							if (value.is_selected) {
								optionFound.error = ''
							}
						}
					})
				} else if (optionFound.type === 'select') {
					optionFound.product_option_value.map((value) => {
						if (
							+value.product_option_value_id ===
							+action.payload.product_option_value_id
						) {
							console.log('option value found')

							value.is_selected = true
							optionFound.error = ''
						} else {
							console.log('option value not found')
							value.is_selected = false
						}
					})
				}
			}
		},
		setProductOptionError: (state, action) => {
			const optionFound = null
			if (action.payload.page) {
				optionFound = state.pageOptions.find(
					(option) =>
						+option.product_option_id === +action.payload.product_option_id
				)
			} else {
				optionFound = state.options.find(
					(option) =>
						+option.product_option_id === +action.payload.product_option_id
				)
			}
			if (optionFound) {
				console.log('option found', action.payload.error)
				optionFound.error = action.payload.error
			}
		},
	},
	extraReducers(builder) {
		builder
			.addCase(HYDRATE, (state, action) => {
				// eslint-disable-next-line no-console
				state.list = action.payload.products.list
				state.itemsCount = action.payload.products.count
				state.status = 'succeeded'
				state.loaded = true
				state.filtersChanged = false
			})
			.addCase(fetchProductsPage.pending, (state, action) => {
				state.status = 'loading'
			})
			.addCase(fetchProductsPage.fulfilled, (state, action) => {
				state.list = action.payload.products.list
				state.itemsCount = action.payload.products.count
				state.status = 'succeeded'
				state.loaded = true
				state.filtersChanged = false
			})
			.addCase(fetchProductsPage.rejected, (state, action) => {
				state.status = 'failed'
				//throw new Error(action.error.message)
			})
			.addCase(lookupProducts.pending, (state, action) => {
				state.headerSearchStatus = 'loading'
			})
			.addCase(lookupProducts.fulfilled, (state, action) => {
				state.headerSearchList = action.payload.products.list
				state.headerSearchStatus = 'succeeded'
			})
			.addCase(lookupProducts.rejected, (state, action) => {
				state.headerSearchStatus = 'failed'
				//throw new Error(action.error.message)
			})
			.addCase(editProduct.pending, (state, action) => {
				state.editStatus = 'loading'
			})
			.addCase(editProduct.fulfilled, (state, action) => {
				state.list = state.list.map((product) =>
					product.id === +action.payload.product.id
						? action.payload.product
						: product
				)
				state.editStatus = 'succeeded'
			})
			.addCase(editProduct.rejected, (state, action) => {
				state.editStatus = 'failed'
				throw new Error(action.error.message)
			})
	},
})

// Action creators are generated for each case reducer function
export const {
	clearProducts,
	setProducts,
	setProductIimagesItem,
	setProductViewType,
	assignProductOption,
	setProductOption,
	setClonedImage,
	clearClonedImage,
	setCartProductId,
	clearCartProductId,
	setShowProductOptions,
	clearShowProductOptions,
	setShowProductOptionsId,
	clearShowProductOptionsId,
	setProductOptionError,
	setOptionsUpdated,
	clearOptionsUpdated,
	setQuantity,
	setPageImageIndex,
	clearHeaderSearch,
} = productsSlice.actions

export default productsSlice.reducer

export const listProducts = (state) => state.products.list
export const listProductsStatus = (state) => state.products.status
export const listProductsLoaded = (state) => state.products.loaded
export const listProductsItemsCount = (state) => state.products.itemsCount
export const ListProductViewType = (state) => state.products.viewType
export const ListHeaderSearchList = (state) => state.products.headerSearchList
export const ListHeaderSearchStatus = (state) =>
	state.products.headerSearchStatus
export const ListCurOptions = (state) => (page) => {
	if (page) {
		return state.products.pageOptions
	} else {
		return state.products.options
	}
}
export const ListPageImageIndex = (state) => state.products.pageImageIndex
export const ListCartProductId = (state) => state.products.cartProductId
export const ProductOptionsShow = (state) => state.products.showProductOptions
export const ProductOptionsId = (state) => state.products.showProductOptionsId
export const ListClonedImage = (state) => state.products.clonedImage
export const isOptionsUpdated = (state) => (page) => {
	if (page) {
		return state.products.pageOptionsUpdated
	} else {
		return state.products.optionsUpdated
	}
}
export const listQuantity = (state) => (page) => {
	if (page) {
		return state.products.pageQuantity
	} else {
		return state.products.quantity
	}
}
export const isPageOptionsUpdated = (state) => state.products.pageOptionsUpdated

export const selectProductById = (state) => (productId) => {
	return state.products.list.find((product) => +product.id === +productId)
}
