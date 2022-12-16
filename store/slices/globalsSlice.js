import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../axiosInstance'
import { HYDRATE } from 'next-redux-wrapper'

const initialState = {
	lang_settings: null,
	translations: null,
	languages: null,
	currency: null,
	settings: null,
	modules: null,
	user: null,
	status: 'idle',
	showTootip: false,
}

export const fetchGlobals = createAsyncThunk(
	'/globals/fetchSettings',
	async () => {
		const response = await axiosInstance.post('/settings')

		console.log('response.data', response.data)
		return response.data
	}
)

export const globalsSlice = createSlice({
	name: 'globals',
	initialState,
	reducers: {
		setGlobals: (state, action) => {
			state.lang_settings = action.payload.globals.lang_settings
			state.translations = action.payload.globals.translations
			state.languages = action.payload.globals.languages
			state.currency = action.payload.globals.currency
			state.settings = action.payload.globals.settings
			state.modules = action.payload.globals.modules
			state.user = action.payload.globals.user
			state.status = 'succeeded'
		},
		clearGlobals: (state) => {
			state.lang_settings = initialState.lang_settings
			state.translations = initialState.translations
			state.languages = initialState.languages
			state.currency = initialState.currency
			state.settings = initialState.settings
			state.modules = initialState.modules
			state.user = initialState.user
			state.status = 'idle'
		},
		setTootipShow: (state, action) => {
			state.showTootip = action.payload
		},
	},
	extraReducers(builder) {
		builder
			.addCase(HYDRATE, (state, action) => {
				// eslint-disable-next-line no-console
				state.lang_settings = action.payload.globals.lang_settings
				state.translations = action.payload.globals.translations
				state.languages = action.payload.globals.languages
				state.currency = action.payload.globals.currency
				state.settings = action.payload.globals.settings
				state.modules = action.payload.globals.modules
				state.user = action.payload.globals.user
				state.status = 'succeeded'
			})
			.addCase(fetchGlobals.pending, (state, action) => {
				state.status = 'loading'
			})
			.addCase(fetchGlobals.fulfilled, (state, action) => {
				state.lang_settings = action.payload.lang_settings
				state.translations = action.payload.translations
				state.languages = action.payload.languages
				state.currency = action.payload.currency
				state.settings = action.payload.settings
				state.modules = action.payload.modules
				state.user = action.payload.user
				state.status = 'succeeded'
			})
			.addCase(fetchGlobals.rejected, (state, action) => {
				state.status = 'failed'
				throw new Error(action.error.message)
			})
	},
})

// Action creators are generated for each case reducer function
export const { clearGlobals, setGlobals, setTootipShow } = globalsSlice.actions

export default globalsSlice.reducer

export const listTranslations =
	(state) =>
	(phrase, params = []) => {
		if (
			state.globals.translations &&
			state.globals.translations[phrase] &&
			params.length
		) {
			let retVal = state.globals.translations[phrase]
			params.forEach(function (item) {
				retVal = retVal.replace('%s', item)
			})
			return retVal
		} else if (state.globals.translations) {
			return state.globals.translations[phrase]
				? state.globals.translations[phrase]
				: phrase
		} else {
			return phrase
		}
	}
export const listLangSettings = (state) => state.globals.lang_settings
export const listLanguages = (state) => state.globals.languages
export const listCurrency = (state) => state.globals.currency
export const listSettings = (state) => state.globals.settings
export const listModules =
	(state) =>
	(page, position = '', module = '') => {
		if (state.globals.modules && state.globals.modules[page]) {
			if (position && state.globals.modules[page][position]) {
				if (module) {
					const found = state.globals.modules[page][position].find(
						(item) => item.moduleClass === module
					)
					if (found) {
						return found
					}
					return []
				}
				return state.globals.modules[page][position]
			}
			return state.globals.modules[page]
		}
		return []
	}
export const listUser = (state) => state.globals.user
export const listSettingsStatus = (state) => state.globals.status
export const listTooltipShow = (state) => state.globals.showTootip
