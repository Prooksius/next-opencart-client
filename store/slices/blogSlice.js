import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Router from 'next/router'
import { ARTICLES_LIMIT, serializeObj } from 'config'

const initialState = {
	page: 1,
	itemsInPage: ARTICLES_LIMIT,
	sortOrder: 'default',
	filtersChanged: false,
	status: 'idle',
}

export const blogSlice = createSlice({
	name: 'blog',
	initialState,
	reducers: {
		setPage: (state, action) => {
			state.page = action.payload
			state.filtersChanged = true
		},
		setItemsInPage: (state, action) => {
			state.itemsInPage = action.payload
			state.filtersChanged = true
		},
		setSortOrder: (state, action) => {
			state.sortOrder = action.payload
			state.filtersChanged = true
		},
		setStatus: (state, action) => {
			state.status = action.payload
		},
		setFilterChanged: (state, action) => {
			state.filtersChanged = true
		},
		clearFilterChanged: (state, action) => {
			state.filtersChanged = false
		},
	},
})

// Action creators are generated for each case reducer function
export const {
	setPage,
	setItemsInPage,
	setSortOrder,
	setFilterChanged,
	clearFilterChanged,
	setStatus,
} = blogSlice.actions

export default blogSlice.reducer

export const listPage = (state) => state.blog.page
export const listItemsInPage = (state) => state.blog.itemsInPage
export const listSortOrder = (state) => state.blog.sortOrder
export const listStatus = (state) => state.blog.status
export const isFiltersChanged = (state) => state.blog.filtersChanged
export const getFilterPath =
	(state) =>
	(routerQuery = null) => {
		let path = ''
		let query = Object.assign({}, routerQuery ? routerQuery : {})
		if (typeof window !== 'undefined') {
			query = Object.assign({}, Router.query)
		}

		if (state.blog.page !== 1) {
			query.page = state.blog.page
		} else {
			delete query.page
		}

		if (state.blog.sortOrder !== 'default') {
			query.sort = state.blog.sortOrder
		} else {
			delete query.sort
		}

		if (state.blog.itemsInPage !== ARTICLES_LIMIT) {
			query.limit = state.blog.itemsInPage
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
				'/blog/' +
				(Router.query.slug.constructor === Array
					? Router.query.slug.join('/')
					: Router.query.slug)
			if (
				Router.asPath !== basePath + path &&
				Router.query.slug.constructor === Array
			) {
				console.log('path change')
				Router.push(basePath + path, basePath + path, { shallow: true })
			}
		}
		return query
	}
