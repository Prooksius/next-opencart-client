import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Router from 'next/router'
import { ARTICLES_LIMIT, serializeObj } from 'config'
import { RootState } from '../store'
import { TStatus } from 'types'

interface BlogState {
	page: number
	itemsInPage: number
	sortOrder: string
	filtersChanged: boolean
	status: TStatus
}

const initialState: BlogState = {
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
		setPage: (state, action: PayloadAction<number>) => {
			state.page = action.payload
			state.filtersChanged = true
		},
		setItemsInPage: (state, action: PayloadAction<number>) => {
			state.itemsInPage = action.payload
			state.filtersChanged = true
		},
		setSortOrder: (state, action: PayloadAction<string>) => {
			state.sortOrder = action.payload
			state.filtersChanged = true
		},
		setStatus: (state, action: PayloadAction<TStatus>) => {
			state.status = action.payload
		},
		setFilterChanged: (state) => {
			state.filtersChanged = true
		},
		clearFilterChanged: (state) => {
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

export const listPage = (state: RootState) => state.blog.page
export const listItemsInPage = (state: RootState) => state.blog.itemsInPage
export const listSortOrder = (state: RootState) => state.blog.sortOrder
export const listStatus = (state: RootState) => state.blog.status
export const isFiltersChanged = (state: RootState) => state.blog.filtersChanged
export const getFilterPath =
	(state: RootState) =>
	(
		routerQuery: Record<
			string,
			string | string[] | number | undefined
		> | null = null
	) => {
		let path = ''
		let query: Record<string, string | string[] | number | undefined> =
			Object.assign({}, routerQuery ? routerQuery : {})

		if (typeof window !== 'undefined') {
			query = Object.assign({}, Router.query ? Router.query : {})
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
