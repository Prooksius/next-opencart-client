import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { axiosInstance } from '../axiosInstance'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { PRODUCTS_LIMIT, serializeObj, optionsWithValue } from 'config'
import { HYDRATE } from 'next-redux-wrapper'
import { RootState } from '../store'
import { TStatus } from 'types'

export type TPricePrefix = '+' | '-'

export interface TProductOptionValue {
	product_option_value_id: number
	option_value_id: number
	name: string
	image: string
	color: string
	quantity: number
	subtract: number
	price: string
	price_prefix: TPricePrefix
	weight: string
	weight_prefix: TPricePrefix
	alias: string
	is_selected: boolean
}

export interface TProductOption {
	product_option_id: number
	product_option_value: TProductOptionValue[]
	option_id: number
	name: string
	type: string
	value: string
	required: boolean
	error: string
	alias: string
}

export interface TProductImage {
	id: string
	image: string
	thumb: string
	thumb_gallery?: string
	thumb_big?: string
	sort_order?: string
}

export interface TProductFilter {
	filter_id: number
	name: string
	icon: string
}

export interface TProductAttribute {
	attribute_id: number
	name: string
	icon: string
	text: string
}
export interface TProductAttributeGroup {
	attribute_group_id: number
	name: string
	attribute: TProductAttribute[]
}

export interface TProductOtherColor {
	product_id: number
	product_slug: string
	product_image: string
	product_thumb: string
	color_image: string
	color_name: string
}

export interface TProduct {
	id: number
	alias: string
	name: string
	description: string
	short_name: string
	meta_title: string
	meta_h1: string
	meta_description: string
	meta_keyword: string
	tag: string
	model: string
	sku: string
	upc: string
	ean: string
	jan: string
	isbn: string
	mpn: string
	location: Location
	quantity: number
	stock_status: string
	stock_status_id: number
	image: string
	thumb: string
	manufacturer_id: number
	manufacturer: string
	price: number
	special: number
	color_name: null | string
	color_image: null | string
	points: number
	date_available: number
	weight: number
	weight_str: string
	weight_class_id: number
	length: number
	length_str: string
	width: number
	width_str: string
	height: number
	height_str: string
	length_class_id: number
	subtract: number
	rating: number
	reviews: number
	minimum: number
	sort_order: number
	status: number
	created_at: number
	updated_at: number
	viewed: number
	options_count: number
	price_str: string
	special_str: string
	special_percent: string
	attributes: TProductAttributeGroup[]
	options: TProductOption[]
	filters: TProductFilter[]
	images: TProductImage[]
	related: TProduct[]
	other_colors: TProductOtherColor[]
}

export interface TProductClonedImage {
	thumb: string
	name: string
	height: string
}

export type TProductListViewType = 'line' | 'grid2' | 'grid3'

type TProductsInResponse = {
	list: TProduct[]
	page: number
	count: number
	lang: string
}

export type ProductPageResponse = {
	success: number
	products: TProductsInResponse
}

type TSetProductsParams = {
	products: TProductsInResponse
	serverViewType: TProductListViewType
}

interface ProductState {
	list: TProduct[]
	page: number
	itemsCount: number
	sortOrder: string
	itemsInPage: number
	viewType: TProductListViewType
	status: TStatus
	editStatus: TStatus
	loaded: boolean
	error: string | null
	clonedImage: TProductClonedImage | null
	cartProductId: number | null
	showProductOptions: boolean
	showProductOptionsId: number
	options: TProductOption[]
	optionsUpdated: boolean
	quantity: number
	pageOptions: TProductOption[]
	pageOptionsUpdated: boolean
	pageQuantity: number
	headerSearchList: TProduct[]
	headerSearchStatus: TStatus
	favourites: TProduct[]
	favouritesPage: number
	compares: TProduct[]
	comparesPage: number
}

const initialState: ProductState = {
	list: [],
	page: 1,
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
	headerSearchList: [],
	headerSearchStatus: 'idle',
	favourites: [],
	favouritesPage: 1,
	compares: [],
	comparesPage: 1,
}

export const fetchProductsPage = createAsyncThunk(
	'products/fetchProductsPage',
	async (
		{
			query,
			type = '',
		}: {
			query: Record<string, string | number | string[] | undefined>
			type?: string
		},
		{ dispatch, getState }
	) => {
		const lang = getCookie('lang')
		const bodyData = new FormData()
		bodyData.append('lang', typeof lang === 'string' ? lang : '')

		console.log('query', query)

		const response = await axiosInstance.post<ProductPageResponse>(
			`/product/${type ? type + '-' : ''}page?` + serializeObj(query),
			bodyData
		)

		console.log('response.data (fetchProductsPage)', response.data)
		return response.data
	}
)

export const lookupProducts = createAsyncThunk(
	'products/lookupProducts',
	async ({ query }: { query: Record<string, string> }) => {
		const lang = getCookie('lang')
		const bodyData = new FormData()
		bodyData.append('lang', typeof lang === 'string' ? lang : '')

		const response = await axiosInstance.post<ProductPageResponse>(
			//'/product/lookup?' + serializeObj(query),
			'/product/page?' + serializeObj(query),
			bodyData
		)

		console.log('lookup response.data', response.data)
		return response.data
	}
)

export const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
		setProducts: (state, action: PayloadAction<TSetProductsParams>) => {
			state.list = action.payload.products.list
			state.itemsCount = action.payload.products.count
			state.viewType = action.payload.serverViewType || 'grid3'
			state.status = 'succeeded'
			state.loaded = true
		},
		setFavourites: (state, action: PayloadAction<TProduct[]>) => {
			state.favourites = action.payload
		},
		addToFavourites: (state, action: PayloadAction<TProduct>) => {
			state.favourites.push(action.payload)
		},
		removeFromFavourites: (state, action: PayloadAction<number>) => {
			state.favourites = state.favourites.filter(
				(item) => item.id !== action.payload
			)
		},
		clearFavourites: (state) => {
			state.favourites = []
		},
		setFavouritesPage: (state, action: PayloadAction<number>) => {
			console.log('new page: ', action.payload)
			state.favouritesPage = action.payload
		},
		setCompares: (state, action: PayloadAction<TProduct[]>) => {
			state.compares = action.payload
		},
		addToCompares: (state, action: PayloadAction<TProduct>) => {
			state.compares.push(action.payload)
		},
		removeFromCompares: (state, action: PayloadAction<number>) => {
			state.compares = state.compares.filter(
				(item) => item.id !== action.payload
			)
		},
		clearCompares: (state) => {
			state.compares = []
		},
		setComparesPage: (state, action: PayloadAction<number>) => {
			state.comparesPage = action.payload
		},
		clearProducts: (state) => {
			state.list = initialState.list
			state.itemsCount = initialState.itemsCount
			state.status = initialState.status
			state.viewType = initialState.viewType
			state.loaded = initialState.loaded
			state.error = initialState.error
		},
		setProductViewType: (
			state,
			action: PayloadAction<TProductListViewType>
		) => {
			state.viewType = action.payload
		},
		setClonedImage: (state, action: PayloadAction<TProductClonedImage>) => {
			state.clonedImage = action.payload
		},
		clearClonedImage: (state) => {
			state.clonedImage = null
		},
		clearHeaderSearch: (state) => {
			state.headerSearchList = []
			state.headerSearchStatus = 'idle'
		},
		setCartProductId: (state, action: PayloadAction<number>) => {
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
		setQuantity: (
			state,
			action: PayloadAction<{ page: boolean; quantity: number }>
		) => {
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
			let optionFound: TProductOption | undefined = undefined
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
							if (optionFound) optionFound.error = ''
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
								if (optionFound) optionFound.error = ''
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
							if (optionFound) optionFound.error = ''
						} else {
							console.log('option value not found')
							value.is_selected = false
						}
					})
				}
			}
		},
		setProductOptionError: (state, action) => {
			let optionFound = null
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
			.addCase(HYDRATE, (state, action: any) => {
				// eslint-disable-next-line no-console
				state.list = action.payload.products.list
				state.itemsCount = action.payload.products.count
				state.favourites = action.payload.products.favourites
				state.favouritesPage = action.payload.products.favouritesPage
				state.compares = action.payload.products.compares
				state.comparesPage = action.payload.products.comparesPage
				state.status = 'succeeded'
				state.loaded = true
			})
			.addCase(fetchProductsPage.pending, (state, action) => {
				state.status = 'loading'
			})
			.addCase(fetchProductsPage.fulfilled, (state, action) => {
				state.list = action.payload.products.list
				state.itemsCount = action.payload.products.count
				state.status = 'succeeded'
				state.loaded = true
			})
			.addCase(fetchProductsPage.rejected, (state, action) => {
				state.status = 'failed'
				//throw new Error(action.error.message)
			})
			.addCase(lookupProducts.pending, (state) => {
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
	},
})

// Action creators are generated for each case reducer function
export const {
	clearProducts,
	setProducts,
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
	clearHeaderSearch,
	setFavourites,
	addToFavourites,
	removeFromFavourites,
	clearFavourites,
	setFavouritesPage,
	setCompares,
	addToCompares,
	removeFromCompares,
	clearCompares,
	setComparesPage,
} = productsSlice.actions

export default productsSlice.reducer

const compareProducts = (a: TProduct, b: TProduct, sort: string): number => {
	if (sort === 'default') {
		return 0
	}
	if (sort === 'price' || sort === '-price') {
		if ((a.special ? a.special : a.price) > (b.special ? b.special : b.price)) {
			return sort === 'price' ? 1 : -1
		}
		if ((a.special ? a.special : a.price) < (b.special ? b.special : b.price)) {
			return sort === 'price' ? -1 : 1
		}
	}

	return 0
}

export const listProducts = (state: RootState) => state.products.list
export const listProductsStatus = (state: RootState) => state.products.status
export const listProductsLoaded = (state: RootState) => state.products.loaded
export const listProductsItemsCount = (state: RootState) =>
	state.products.itemsCount
export const ListProductViewType = (state: RootState) => state.products.viewType
export const ListHeaderSearchList = (state: RootState) =>
	state.products.headerSearchList
export const ListHeaderSearchStatus = (state: RootState) =>
	state.products.headerSearchStatus
export const ListCurOptions = (state: RootState) => (page: boolean) => {
	if (page) {
		return state.products.pageOptions
	} else {
		return state.products.options
	}
}
export const ListCartProductId = (state: RootState) =>
	state.products.cartProductId
export const ProductOptionsShow = (state: RootState) =>
	state.products.showProductOptions
export const ProductOptionsId = (state: RootState) =>
	state.products.showProductOptionsId
export const ListClonedImage = (state: RootState) => state.products.clonedImage
export const isOptionsUpdated = (state: RootState) => (page: boolean) => {
	if (page) {
		return state.products.pageOptionsUpdated
	} else {
		return state.products.optionsUpdated
	}
}
export const listQuantity = (state: RootState) => (page: boolean) => {
	if (page) {
		return state.products.pageQuantity
	} else {
		return state.products.quantity
	}
}
export const isPageOptionsUpdated = (state: RootState) =>
	state.products.pageOptionsUpdated

export const selectProductById = (state: RootState) => (productId: string) => {
	return state.products.list.find((product) => +product.id === +productId)
}

export const listFavourites = (state: RootState) => {
	const end = state.categories.itemsInPage * state.products.favouritesPage
	return state.products.favourites
		.slice()
		.sort((a, b) => compareProducts(a, b, state.categories.sortOrder))
		.slice(
			state.categories.itemsInPage * (state.products.favouritesPage - 1),
			end > state.products.favourites.length
				? state.products.favourites.length
				: end
		)
}
export const listFavouritesCount = (state: RootState) =>
	state.products.favourites.length
export const listFavouritesPage = (state: RootState) =>
	state.products.favouritesPage

export const listCompares = (state: RootState) => state.products.compares
export const listComparesCount = (state: RootState) =>
	state.products.compares.length
export const listComparesPage = (state: RootState) =>
	state.products.comparesPage
