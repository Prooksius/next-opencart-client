import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import type { TCurrencyData, TGlobals, TLanguage, TModulePosition, TModulesFull, TSettings, TStatus, TUser } from 'types'
import { RootState } from '../store'

interface GlobalState {
	lang_settings: Record<string, string> | null
	translations: Record<string, string> | null
	languages: TLanguage[] | null
	currency: TCurrencyData | null
	modules: TModulesFull | null
	settings: TSettings | null
	user: TUser | null
	status: TStatus
	showTootip: boolean
}

const initialState: GlobalState = {
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

export const globalsSlice = createSlice({
	name: 'globals',
	initialState,
	reducers: {
		setGlobals: (state, action: PayloadAction<TGlobals>) => {
			state.lang_settings = action.payload.lang_settings
			state.translations = action.payload.translations
			state.languages = action.payload.languages
			state.currency = action.payload.currency
			state.settings = action.payload.settings
			state.modules = action.payload.modules
			state.user = action.payload.user
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
		setTootipShow: (state, action: PayloadAction<boolean>) => {
			state.showTootip = action.payload
		},
	},
	extraReducers(builder) {
		builder.addCase(HYDRATE, (state, action: any) => {
			state.lang_settings = action.payload.globals.lang_settings
			state.translations = action.payload.globals.translations
			state.languages = action.payload.globals.languages
			state.currency = action.payload.globals.currency
			state.settings = action.payload.globals.settings
			state.modules = action.payload.globals.modules
			state.user = action.payload.globals.user
			state.status = 'succeeded'
		})
	},
})

// Action creators are generated for each case reducer function
export const { clearGlobals, setGlobals, setTootipShow } = globalsSlice.actions

export default globalsSlice.reducer

export const listTranslations =
	(state: RootState) =>
	(phrase: string, params: string[] = []) => {
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
export const listLangSettings = (state: RootState) =>
	state.globals.lang_settings
export const listLanguages = (state: RootState) => state.globals.languages
export const listCurrency = (state: RootState) => state.globals.currency
export const listSettings = (state: RootState) => state.globals.settings
export const listModules =
	(state: RootState) =>
	(page: string, position: TModulePosition | null = null, module = '') => {
		if (state.globals.modules && state.globals.modules[page]) {
			if (position && state.globals.modules[page][position]) {
				if (module) {
					const found = state.globals.modules[page][position]?.find(
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
export const listModulesByPosition =
	(state: RootState) => (page: string, position: TModulePosition) => {
		if (state.globals.modules && state.globals.modules[page]) {
			if (state.globals.modules[page][position]) {
				return state.globals.modules[page][position]
			}
		}
		return []
	}
export const listModulesByPage = (state: RootState) => (page: string) => {
	if (state.globals.modules && state.globals.modules[page]) {
		return state.globals.modules[page]
	}
	return []
}
export const listUser = (state: RootState) => state.globals.user
export const listSettingsStatus = (state: RootState) => state.globals.status
export const listTooltipShow = (state: RootState) => state.globals.showTootip
