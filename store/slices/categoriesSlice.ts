import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { axiosInstance } from '../axiosInstance'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { serializeObj } from 'config'
import Router from 'next/router'
import isEqual from 'lodash/isEqual'
import { PRODUCTS_LIMIT } from 'config'
import { HYDRATE } from 'next-redux-wrapper'
import clonedeep from 'lodash.clonedeep'
import { RootState } from '../store'
import { TBreadcrumb, TRequestQuery, TStatus } from 'types'

export type TCategory = {
	id: number
	image: string
	thumb: string
	alias: string
	parent_id: number
	top: number
	sort_order: number
	status: number
	created_at: number
	updated_at: number
	name: string
	description: string
	meta_title: string
	meta_h1: string
	meta_description: string
	meta_keyword: string
	products_count: number
	parent_path?: string
}

export interface TSavedFilterSelected {
	alias: string
	name: string
	icon: string
}
export interface TSavedFilter {
	value_type: number
	group: string
	alias: string
	name: string
	icon: string
	selected: TSavedFilterSelected[]
}

export interface TFilter {
	filter_id: number
	eng_name: string
	name: string
	is_color: number
	is_option: number
	quantity: number
	is_selected: boolean
	icon?: string
}

export interface TFilterGroup {
	filter_group_id: number | string
	type: string
	name: string
	description: string
	eng_name: string
	is_open: boolean
	value_type: number
	icon: string
	filter: TFilter[]
}

export interface TFilters {
	saved_filters: TSavedFilter[]
	prices_out: boolean
	filter_groups: TFilterGroup[]
	min_price: string
	max_price: string
	original_min_price: number
	original_max_price: number
  decimal_place: string
}

interface TResponseCategories {
	current: TCategory | null
	parent: TCategory | null
	childs: TCategory[] | null
	roots: TCategory[] | null
}

interface TResponseCatalogInner {
	categories: TResponseCategories
	filters: TFilters
}
export interface TCatalogAndQuery {
	catalog: TResponseCatalogInner
	query: TRequestQuery
}
export interface TCatalogResponse {
	success: number
	breadcrumbs: TBreadcrumb[]
	catalog: TResponseCatalogInner
}

export interface TChangeFiltersParams {
	group_type: string
	group_id: number | string
	filter_id: number
	item_type: string
}
export interface TResetFiltersParams {
	group: string
	param: string
	value: string
	item_type: string
}

interface CategoryState {
	parent: TCategory | null
	current: TCategory | null
	childs: TCategory[]
	filters: TFilters | null
	requestQuery: TRequestQuery
	filtersChanged: number
	filtersHeightChanged: boolean
	sortOrder: string
	itemsInPage: number
	productsPage: number
	productFiltersChanged: number
	status: TStatus
	loaded: boolean
	rootStatus: TStatus
	rootLoaded: boolean
	breadcrumbs: TBreadcrumb[]
	breadcrumbsStatus: TStatus
	breadcrumbsLoaded: boolean
	error: string | null
	prices_open: boolean
}

const initialState: CategoryState = {
	parent: null,
	current: null,
	childs: [],
	filters: null,
	requestQuery: {},
	filtersChanged: 0,
	filtersHeightChanged: false,
	sortOrder: 'default',
	itemsInPage: PRODUCTS_LIMIT,
	productsPage: 1,
	productFiltersChanged: 0,
	status: 'idle',
	loaded: false,
	rootStatus: 'idle',
	rootLoaded: false,
	breadcrumbs: [],
	breadcrumbsStatus: 'idle',
	breadcrumbsLoaded: false,
	error: null,
	prices_open: true,
}

export const fetchCategory = createAsyncThunk(
	'categories/fetchCategory',
	async ({ slug }: { slug: string | string[] | undefined }, { getState }) => {
		const { categories } = <RootState>getState()

		const curQuery: Record<string, string | string[] | number> = slug
			? { slug }
			: {}

		if (categories.filters) {
			categories.filters.filter_groups.map((group) => {
				if (group.filter.length > 0) {
					let values: string[] = []
					group.filter
						.filter((item) => item.is_selected === true)
						.map((sel) => {
							values.push(sel.eng_name)
						})
					if (values.length) {
						curQuery[group.eng_name] = values.join(',')
					} else {
						delete curQuery[group.eng_name]
					}
				}
			})
			if (categories.filters.min_price && categories.filters.max_price) {
				curQuery.price =
					categories.filters.min_price + '-' + categories.filters.max_price
			} else if (categories.filters.min_price) {
				curQuery.price = categories.filters.min_price + '-'
			} else if (categories.filters.max_price) {
				curQuery.price = '-' + categories.filters.max_price
			} else {
				delete curQuery.price
			}
		}

		if (categories.productsPage !== 1) {
			curQuery.page = categories.productsPage
		} else {
			delete curQuery.page
		}

		if (categories.sortOrder !== 'default') {
			curQuery.sort = categories.sortOrder
		} else {
			delete curQuery.sort
		}

		if (categories.itemsInPage !== PRODUCTS_LIMIT) {
			curQuery.limit = categories.itemsInPage
		} else {
			delete curQuery.limit
		}

		const lang = getCookie('lang')

		const bodyData = new FormData()
		bodyData.append('lang', typeof lang === 'string' ? lang : '')

		const response = await axiosInstance.post<TCatalogResponse>(
			'/category?' + serializeObj(curQuery),
			bodyData
		)

		console.log('response.data (fetchCategory)', response.data)
		return {
			catalog: response.data.catalog,
			breadcrumbs: response.data.breadcrumbs,
			curQuery,
		}
	}
)

export const categoriesSlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {
		setCategories: (state, action: PayloadAction<TCatalogAndQuery>) => {
			console.log('action.payload.catalog.', action.payload.catalog)
			state.parent = action.payload.catalog.categories.parent
			state.current = action.payload.catalog.categories.current
			state.childs = action.payload.catalog.categories.childs || []
			state.filters = action.payload.catalog.filters
			if (!isEqual(state.requestQuery, action.payload.query)) {
				state.requestQuery = action.payload.query
			}
			state.sortOrder = (action.payload.query.sort as string) || 'default'
			state.productsPage = (action.payload.query.page as number) || 1
			state.itemsInPage =
				(action.payload.query.limit as number) || PRODUCTS_LIMIT
			state.status = 'succeeded'
			state.loaded = true
		},
		clearCategories: (state) => {
			state.parent = initialState.parent
			state.current = initialState.current
			state.childs = initialState.childs
			state.filters = initialState.filters
			state.requestQuery = initialState.requestQuery
			state.sortOrder = initialState.sortOrder
			state.productsPage = initialState.productsPage
			state.itemsInPage = initialState.itemsInPage
			state.status = initialState.status
			state.loaded = initialState.loaded
			state.error = initialState.error
		},
		setRequestQuery: (state, action: PayloadAction<TRequestQuery>) => {
			if (!isEqual(state.requestQuery, action.payload)) {
				state.requestQuery = action.payload
			}
		},
		setBreadcrumbs: (state, action: PayloadAction<TBreadcrumb[]>) => {
			state.breadcrumbs = action.payload
		},
		toggleGroup: (state, action: PayloadAction<string | number>) => {
			const group_id = action.payload

			const found_group = state.filters?.filter_groups.find(
				(group) => group.filter_group_id === group_id
			)
			if (found_group) {
				found_group.is_open = !found_group.is_open
				state.filtersHeightChanged = true
			}
		},
		changeFilters: (state, action: PayloadAction<TChangeFiltersParams>) => {
			const group_type = action.payload.group_type
			const group_id = action.payload.group_id
			const filter_id = action.payload.filter_id
			const item_type = action.payload.item_type

			const found_group = state.filters?.filter_groups.find(
				(group) =>
					group.type === group_type && group.filter_group_id === group_id
			)
			if (found_group) {
				console.log('group found')
				const found_filter = found_group.filter.find(
					(item) => item.filter_id === filter_id
				)
				if (found_filter) {
					console.log('item found')
					if (item_type === 'checkbox') {
						found_filter.is_selected = !found_filter.is_selected
						console.log('filters Changed !!!')
						state.filtersChanged++

						if (state.productsPage !== 1) {
							state.productsPage = 1
						}
					}
				}
			}
		},
		// это нужно для сброса фильтров удалением установелнных фильтров
		// в блоке SelectedFiltersBlock
		resetFilters: (state, action: PayloadAction<TResetFiltersParams>) => {
			const group_alias = action.payload.group
			const param = action.payload.param
			const value = action.payload.value
			const item_type = action.payload.item_type

			const found_group = state.filters?.filter_groups.find(
				(group) => group.type === group_alias && group.eng_name === param
			)
			if (found_group) {
				//console.log('group found')
				const found_filter = found_group.filter.find(
					(item) => item.eng_name === value
				)
				if (found_filter) {
					console.log('resetting item found')
					if (item_type === 'checkbox') {
						found_filter.is_selected = false
						console.log('filters Changed !!!')
						state.filtersChanged++

						if (state.productsPage !== 1) {
							state.productsPage = 1
						}
					}
				}
			}
		},
		changePriceFilters: (
			state,
			action: PayloadAction<{ min: string; max: string }>
		) => {
			state.filters!.min_price = action.payload.min
			state.filters!.max_price = action.payload.max
			console.log('Price filters Changed !!!')
			state.filtersChanged++
    },
    togglePrice: (state) => {
      state.prices_open = !state.prices_open
    },
		setFiltersHeightChanged: (state) => {
			state.filtersHeightChanged = true
		},
		clearFiltersHeightChanged: (state) => {
			state.filtersHeightChanged = false
		},
		setFiltersChanged: (state) => {
			state.filtersChanged++
		},
		clearFiltersChanged: (state) => {
			state.filtersChanged = 0
		},
		setProductFiltersChanged: (state) => {
			state.productFiltersChanged++
		},
		clearProductFiltersChanged: (state) => {
			state.productFiltersChanged = 0
		},
		setProductSortOrder: (state, action: PayloadAction<string>) => {
			state.sortOrder = action.payload
			state.productFiltersChanged++
		},
		setProductItemsInPage: (state, action: PayloadAction<number>) => {
			state.itemsInPage = action.payload
			state.productFiltersChanged++
		},
		setProductPage: (state, action: PayloadAction<number>) => {
			state.productsPage = action.payload
			state.productFiltersChanged++
		},
	},
	extraReducers(builder) {
		builder
			.addCase(HYDRATE, (state, action: any) => {
				state.parent = action.payload.categories.parent
				state.breadcrumbs = action.payload.categories.breadcrumbs
				state.current = action.payload.categories.current
				state.childs = action.payload.categories.childs
				state.filters = action.payload.categories.filters
				if (!isEqual(state.requestQuery, action.payload.requestQuery)) {
					state.requestQuery = action.payload.requestQuery
				}
				state.sortOrder =
					action.payload.categories.requestQuery?.sort || 'default'
				state.productsPage = action.payload.categories.requestQuery?.page || 1
				state.itemsInPage =
					action.payload.categories.requestQuery?.limit || PRODUCTS_LIMIT
				state.status = 'succeeded'
				state.loaded = true
			})
			.addCase(fetchCategory.pending, (state, action) => {
				state.status = 'loading'
			})
			.addCase(fetchCategory.fulfilled, (state, action) => {
				state.breadcrumbs = action.payload.breadcrumbs
				state.parent = action.payload.catalog.categories.parent
				state.current = action.payload.catalog.categories.current
				state.childs = action.payload.catalog.categories.childs
					? action.payload.catalog.categories.childs
					: []
				const filters = clonedeep(action.payload.catalog.filters)
				if (filters) {
					filters.filter_groups = filters.filter_groups.map((new_group) => {
						let found_group: TFilterGroup | undefined
						if (state.filters) {
							found_group = state.filters?.filter_groups.find(
								(item) => +item.filter_group_id === +new_group.filter_group_id
							)
						}
						if (found_group) {
							new_group.is_open = found_group.is_open
						}
						return new_group
					})
				}
				state.filters = filters
				// if (!isEqual(state.requestQuery, action.payload.query)) {
				// 	state.requestQuery = action.payload.query
				// }
				state.status = 'succeeded'
				state.loaded = true

				console.log('categories loaded, products changing...')
				state.productFiltersChanged++

				state.breadcrumbsStatus = 'succeeded'
				state.breadcrumbsLoaded = true
			})
			.addCase(fetchCategory.rejected, (state, action) => {
				state.status = 'failed'
				throw new Error(action.error.message)
			})
	},
})

// Action creators are generated for each case reducer function
export const {
	clearCategories,
	setCategories,
	changeFilters,
	toggleGroup,
	resetFilters,
  changePriceFilters,
  togglePrice,
	setFiltersHeightChanged,
	clearFiltersHeightChanged,
	setRequestQuery,
	setBreadcrumbs,

	setFiltersChanged,
	clearFiltersChanged,
	setProductFiltersChanged,
	clearProductFiltersChanged,
	setProductPage,
	setProductSortOrder,
	setProductItemsInPage,
} = categoriesSlice.actions

export default categoriesSlice.reducer

export const listBreadcrumbs = (state: RootState) =>
	state.categories.breadcrumbs
export const listParent = (state: RootState) => state.categories.parent
export const listCurrent = (state: RootState) => state.categories.current
export const listChilds = (state: RootState) => state.categories.childs
export const listFilters = (state: RootState) => state.categories.filters
export const listPricesOpen = (state: RootState) => state.categories.prices_open
export const isFiltersChanged = (state: RootState) =>
	state.categories.filtersChanged
export const isFiltersHeightChanged = (state: RootState) =>
	state.categories.filtersHeightChanged
export const listRequestQuery = (state: RootState) =>
	state.categories.requestQuery
export const listCategoriesStatus = (state: RootState) =>
	state.categories.status
export const listCategoriesLoaded = (state: RootState) =>
	state.categories.loaded
export const listRootsStatus = (state: RootState) => state.categories.rootStatus

export const listProductsPage = (state: RootState) =>
	state.categories.productsPage
export const listProductsSortOrder = (state: RootState) =>
	state.categories.sortOrder
export const listProductsItemsInPage = (state: RootState) =>
	state.categories.itemsInPage
export const isProductFiltersChanged = (state: RootState) =>
	state.categories.productFiltersChanged

export const selectCategoryBySlug = (state: RootState, slug: string) => {
	return state.categories.childs.find((category) => category.alias === slug)
}

export const getFilterPath =
	(state: RootState) =>
	(routerQuery: TRequestQuery | null = null) => {
		let path = ''
		let parts = []
		let query: TRequestQuery = Object.assign({}, routerQuery ? routerQuery : {})
		if (typeof window !== 'undefined') {
			query = Object.assign({}, Router.query ? Router.query : {})
		}

		if (state.categories.filters) {
			state.categories.filters.filter_groups.map((group) => {
				if (group.filter.length > 0) {
					let values: string[] = []
					group.filter
						.filter((item) => item.is_selected === true)
						.map((sel) => {
							values.push(sel.eng_name)
						})
					if (values.length) {
						parts.push(group.eng_name + '=' + values.join(','))
						query[group.eng_name] = values.join(',')
					} else {
						delete query[group.eng_name]
					}
				}
			})
			if (
				state.categories.filters.min_price &&
				state.categories.filters.max_price
			) {
				query.price =
					state.categories.filters.min_price +
					'-' +
					state.categories.filters.max_price
			} else if (state.categories.filters.min_price) {
				query.price = state.categories.filters.min_price + '-'
			} else if (state.categories.filters.max_price) {
				query.price = '-' + state.categories.filters.max_price
			} else {
				delete query.price
			}
		}

		if (state.categories.productsPage !== 1) {
			query.page = state.categories.productsPage
		} else {
			delete query.page
		}

		if (state.categories.sortOrder !== 'default') {
			query.sort = state.categories.sortOrder
		} else {
			delete query.sort
		}

		if (state.categories.itemsInPage !== PRODUCTS_LIMIT) {
			query.limit = state.categories.itemsInPage
		} else {
			delete query.limit
		}

		//if (parts.length) path = '?' + parts.join('&')
		const queryNoSlug = Object.assign({}, query)
		delete queryNoSlug['slug']
		if (Object.keys(queryNoSlug).length > 0) {
			path = '?' + serializeObj(queryNoSlug)
		}

		if (typeof window !== 'undefined') {
			const basePath =
				'/catalog/' +
				(Router.query.slug?.constructor === Array
					? Router.query.slug.join('/')
					: Router.query.slug)
			if (
				Router.asPath !== basePath + path &&
				Router.query.slug?.constructor === Array
			) {
				console.log('path change')
				Router.push(basePath + path, basePath + path, { shallow: true })
			}
		}
		return query
	}

export const getFilterLinkQuery = (state: RootState) => {
	let query: TRequestQuery = {}

	if (state.categories.filters) {
		state.categories.filters.filter_groups.map((group) => {
			if (group.filter.length > 0) {
				let values: string[] = []
				group.filter
					.filter((item) => item.is_selected === true)
					.map((sel) => {
						values.push(sel.eng_name)
					})
				if (values.length) {
					query[group.eng_name] = values.join(',')
				}
			}
		})
		if (
			state.categories.filters.min_price &&
			state.categories.filters.max_price
		) {
			query.price =
				state.categories.filters.min_price +
				'-' +
				state.categories.filters.max_price
		} else if (state.categories.filters.min_price) {
			query.price = state.categories.filters.min_price + '-'
		} else if (state.categories.filters.max_price) {
			query.price = '-' + state.categories.filters.max_price
		}
	}
	return query
}
