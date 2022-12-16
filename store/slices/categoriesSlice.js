import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../axiosInstance'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { serializeObj } from 'config'
import Router from 'next/router'
import isEqual from 'lodash/isEqual'
import { PRODUCTS_LIMIT } from 'config'
import { HYDRATE } from 'next-redux-wrapper'
import clonedeep from 'lodash.clonedeep'

const initialState = {
	current: null,
	childs: [],
	filters: null,
	requestQuery: {},
	filtersChanged: false,
	filtersHeightChanged: false,
	sortOrder: 'default',
	itemsInPage: PRODUCTS_LIMIT,
	productsPage: 1,
	productFiltersChanged: false,
	status: 'idle',
	loaded: false,
	rootStatus: 'idle',
	rootLoaded: false,
	breadcrumbs: [],
	error: null,
}

export const fetchCategory = createAsyncThunk(
	'categories/fetchCategory',
	async ({ query }) => {
		const lang = getCookie('lang')
		const bodyData = new FormData()
		bodyData.append('lang', lang)

		console.log('serializeObj(query)', serializeObj(query))
		const response = await axiosInstance.post(
			'/category?' + serializeObj(query),
			bodyData
		)

		console.log('response.data (fetchCategory)', response.data)
		return {
			catalog: response.data.catalog,
			breadcrumbs: response.data.breadcrumbs,
			query,
		}
	}
)

export const categoriesSlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {
		setCategories: (state, action) => {
			console.log('action.payload.catalog.', action.payload.catalog)
			state.current = action.payload.catalog.categories.current
			state.childs = action.payload.catalog.categories.childs
			state.filters = action.payload.catalog.filters
			//state.filters.filter_groups = clonedeep(state.filters.filter_groups)
			//state.filters.filter_groups.map((item) => {
			//item.filter = clonedeep(item.filter)
			//})
			if (!isEqual(state.requestQuery, action.payload.query)) {
				state.requestQuery = action.payload.query
			}
			state.sortOrder = action.payload.query.sort || 'default'
			state.productsPage = action.payload.query.page || 1
			state.itemsInPage = action.payload.query.limit || PRODUCTS_LIMIT
			//			state.filtersChanged = false
			state.productFiltersChanged = false
			state.status = 'succeeded'
			state.loaded = true
		},
		clearCategories: (state) => {
			state.current = initialState.current
			state.childs = initialState.childs
			state.filters = initialState.filters
			state.requestQuery = initialState.requestQuery
			state.filtersChanged = initialState.filtersChanged
			state.sortOrder = initialState.sortOrder
			state.productsPage = initialState.productsPage
			state.itemsInPage = initialState.itemsInPage
			state.productFiltersChanged = initialState.productFiltersChanged
			state.status = initialState.status
			state.loaded = initialState.loaded
			state.error = initialState.error
		},
		setRequestQuery: (state, action) => {
			if (!isEqual(state.requestQuery, action.payload)) {
				state.requestQuery = action.payload
			}
		},
		setBreadcrumbs: (state, action) => {
			state.breadcrumbs = action.payload
		},
		toggleGroup: (state, action) => {
			const group_id = action.payload

			const found_group = state.filters.filter_groups.find(
				(group) => group.filter_group_id === group_id
			)
			if (found_group) {
				found_group.is_open = !found_group.is_open
				state.filtersHeightChanged = true
			}
		},
		changeFilters: (state, action) => {
			const group_type = action.payload.group_type
			const group_id = action.payload.group_id
			const filter_id = action.payload.filter_id
			const item_type = action.payload.item_type

			const found_group = state.filters.filter_groups.find(
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
						state.filtersChanged = !state.filtersChanged

						if (state.productsPage !== 1) {
							state.productsPage = 1
							//state.productFiltersChanged = true
						}
					}
				}
			}
		},
		// это нужно для сброса фильтров удалением установелнных фильтров
		// в блоке SelectedFiltersBlock
		resetFilters: (state, action) => {
			const group_alias = action.payload.group
			const param = action.payload.param
			const value = action.payload.value
			const item_type = action.payload.item_type

			const found_group = state.filters.filter_groups.find(
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
						state.filtersChanged = !state.filtersChanged

						if (state.productsPage !== 1) {
							state.productsPage = 1
							//state.productFiltersChanged = true
						}
					}
				}
			}
		},
		setFiltersHeightChanged: (state) => {
			state.filtersHeightChanged = true
		},
		clearFiltersHeightChanged: (state) => {
			state.filtersHeightChanged = false
		},
		setProductFiltersChanged: (state) => {
			state.productFiltersChanged = true
		},
		clearProductFiltersChanged: (state) => {
			state.productFiltersChanged = false
		},
		setProductSortOrder: (state, action) => {
			state.sortOrder = action.payload
			state.productFiltersChanged = true
		},
		setProductItemsInPage: (state, action) => {
			state.itemsInPage = action.payload
			state.productFiltersChanged = true
		},
		setProductPage: (state, action) => {
			state.productsPage = action.payload
			state.productFiltersChanged = true
		},
	},
	extraReducers(builder) {
		builder
			.addCase(HYDRATE, (state, action) => {
				state.current = action.payload.categories.current
				state.childs = action.payload.categories.childs
				state.filters = action.payload.categories.filters
				//state.filters.filter_groups = clonedeep(state.filters.filter_groups)
				//state.filters.filter_groups.map((item) => {
				//item.filter = clonedeep(item.filter)
				//})
				if (!isEqual(state.requestQuery, action.payload.requestQuery)) {
					state.requestQuery = action.payload.requestQuery
				}
				state.sortOrder =
					action.payload.categories.requestQuery?.sort || 'default'
				state.productsPage = action.payload.categories.requestQuery?.page || 1
				state.itemsInPage =
					action.payload.categories.requestQuery?.limit || PRODUCTS_LIMIT
				state.filtersChanged = false
				state.productFiltersChanged = false
				state.status = 'succeeded'
				state.loaded = true
			})
			.addCase(fetchCategory.pending, (state, action) => {
				state.status = 'loading'
			})
			.addCase(fetchCategory.fulfilled, (state, action) => {
				state.breadcrumbs = action.payload.breadcrumbs
				state.current = action.payload.catalog.categories.current
				state.childs = action.payload.catalog.categories.childs
				const filters = clonedeep(action.payload.catalog.filters)
				//filters.filter_groups = clonedeep(filters.filter_groups)
				filters.filter_groups.map((item) => {
					//item.filter = clonedeep(item.filter)
				})
				if (filters) {
					filters.filter_groups = filters.filter_groups.map((new_group) => {
						const found_group = false
						if (state.filters) {
							found_group = state.filters.filter_groups.find(
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
				if (!isEqual(state.requestQuery, action.payload.query)) {
					state.requestQuery = action.payload.query
				}
				//				state.filtersChanged = false
				state.status = 'succeeded'
				state.loaded = true

				state.breadcrumbsStatus = 'succeeded'
				state.breadcrumbsLoaded = true
			})
			.addCase(fetchCategory.rejected, (state, action) => {
				state.status = 'failed'
				//throw new Error(action.error.message)
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
	setFiltersHeightChanged,
	clearFiltersHeightChanged,
	setRequestQuery,
	setBreadcrumbs,

	setProductFiltersChanged,
	setProductPage,
	setProductSortOrder,
	setProductItemsInPage,
	clearProductFiltersChanged,
} = categoriesSlice.actions

export default categoriesSlice.reducer

export const listBreadcrumbs = (state) => state.categories.breadcrumbs
export const listRootCats = (state) => state.categories.rootCats
export const listCurrent = (state) => state.categories.current
export const listChilds = (state) => state.categories.childs
export const listFilters = (state) => state.categories.filters
export const isFiltersChanged = (state) => state.categories.filtersChanged
export const isFiltersHeightChanged = (state) =>
	state.categories.filtersHeightChanged
export const listRequestQuery = (state) => state.categories.requestQuery
export const listCategoriesStatus = (state) => state.categories.status
export const listCategoriesLoaded = (state) => state.categories.loaded
export const listRootsStatus = (state) => state.categories.rootStatus

export const listProductsPage = (state) => state.categories.productsPage
export const listProductsSortOrder = (state) => state.categories.sortOrder
export const listProductsItemsInPage = (state) => state.categories.itemsInPage
export const isProductFiltersChanged = (state) =>
	state.categories.productFiltersChanged

export const selectCategoryBySlug = (state, slug) => {
	return state.categories.list.find((category) => category.slug === slug)
}

export const getFilterPath =
	(state) =>
	(routerQuery = null) => {
		let path = ''
		let parts = []
		let query = Object.assign({}, routerQuery ? routerQuery : {})
		if (typeof window !== 'undefined') {
			query = Object.assign({}, Router.query)
		}

		if (state.categories.filters) {
			state.categories.filters.filter_groups.map((group) => {
				if (group.filter.length > 0) {
					let values = []
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

export const getFilterLinkQuery = (state) => {
	let parts = []
	let query = {}

	if (state.categories.filters) {
		state.categories.filters.filter_groups.map((group) => {
			if (group.filter.length > 0) {
				let values = []
				group.filter
					.filter((item) => item.is_selected === true)
					.map((sel) => {
						values.push(sel.eng_name)
					})
				if (values.length) {
					parts.push(group.eng_name + '=' + values.join(','))
					query[group.eng_name] = values.join(',')
				}
			}
		})
	}
	return query
}
