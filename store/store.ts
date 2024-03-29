import { configureStore } from '@reduxjs/toolkit'
import globalsReducer from './slices/globalsSlice'
import blogReducer from './slices/blogSlice'
import productsReducer from './slices/productsSlice'
import categoriesReducer from './slices/categoriesSlice'
import cartReducer from './slices/cartSlice'
import { createWrapper } from 'next-redux-wrapper'

const store = configureStore({
	reducer: {
		globals: globalsReducer,
		blog: blogReducer,
		cart: cartReducer,
		products: productsReducer,
		categories: categoriesReducer,
	},
	devTools: true,
})

export const wrapper = createWrapper(() => store)

export type AppStore = typeof store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
