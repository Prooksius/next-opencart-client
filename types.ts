import { TProduct } from './store/slices/productsSlice'

export type TStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type TPopupContentType = 'image' | 'video' | 'usual'

export interface TLanguage {
	locale: string
	name: string
	code: string
	selected: boolean
}

export interface TCurrencyData {
	symbol_left: string
	symbol_right: string
	decimal_place: number
}

export interface TBreadcrumb {
	title: string
	href: string
}

export interface TUser extends Record<string, string | number | boolean> {
	id: number
	first_name: string
	last_name: string
	middle_name: string
	email: string
	phone: string
	avatar: string
	auth_key: string
	error: boolean
}

export interface TAddress {
	country: string
	countryCode: string
	region: string
	regionCode?: string
	city: string
	street: string
	house: string
	geo_lat: string
	geo_lon: string
	postalCode: string
}

export type TRegion = {
	name: string
	code: string
}

export type TOptionType =
	| 'select'
	| 'radio'
	| 'checkbox'
	| 'text'
	| 'textarea'
	| 'date'
	| 'time'
	| 'datetime'

export interface TCartProductOption {
	name: string
	value: string
	type: TOptionType
}
export interface TCartProduct {
	cart_id: number
	product_id: number
	thumb: string
	name: string
	model: string
	option: TCartProductOption[]
	quantity: number
	price: number
	price_str: string
	total: number
	total_str: string
	alias: string
}

export type TCartTotal = {
	code: string
	title: string
	value: number
	value_str: string
}

export type TCartSelectedOptions = Record<number, string | number | number[]>

type TDeliveryQuoteItem = {
	code: string
	title: string
	cost: number
	text: string
}
type TDeliveryQuote = Record<string, TDeliveryQuoteItem>

export interface TDelivery {
	code: string
	title: string
	quote: TDeliveryQuote
	quote_items: TDeliveryQuoteItem[]
	error: boolean
}
export type TPayment = {
	code: string
	title: string
	terms: string
}

export type TCurrentCartAction = {
	code: string
	error: boolean
}

// Modules types
export interface FeaturedProductsSettings {
	title: Record<string, string>
	subtitle: Record<string, string>
	visible: string
	products: string[]
}
export interface FeaturedProductsContent {
	title: string
	subtitle: string
	visible: string
	products: TProduct[]
}
export interface SpecialProductsSettings {
	title: Record<string, string>
	subtitle: Record<string, string>
	visible: string
	limits: string
}
export interface SpecialProductsContent {
	title: string
	subtitle: string
	visible: string
	limits: string
	products: TProduct[]
}
export interface LookedProductsSettings {
	title: Record<string, string>
	subtitle: Record<string, string>
	visible: string
}
export interface LookedProductsContent {
	title: string
	subtitle: string
	visible: string
	products: TProduct[]
}
export interface MainSliderSettings {
	banner_id: string
	visible: string
	width: string
	height: string
}

export interface TSliderImage {
	id: number
	title: string
	text1: string
	text2: string
	text3: string
	image: string
	link: string
	thumb: string
}
export interface MainSliderContent {
	banner_id: string
	visible: string
	width: string
	height: string
	images: TSliderImage[]
}
export interface HtmlContentSettings {
	html: Record<string, string>
}
export interface HtmlContentContent {
	html: string
}

export type TModuleSettings =
	| HtmlContentSettings
	| MainSliderSettings
	| LookedProductsSettings
	| SpecialProductsSettings

export type TModuleContent =
	| HtmlContentContent
	| MainSliderContent
	| LookedProductsContent
	| SpecialProductsContent

type TPhoneMask = {
	code: string
	mask: string
	flag: string
}
type TFooterIcon = {
	image: string
	sort_order: string
}

export type TModulePosition =
	| 'page-top'
	| 'page-bottom'
	| 'content-top'
	| 'content-bottom'

export type TModuleAllContent = {
	moduleClass: string
	settings: TModuleSettings
}
export type TModulePageContent = {
	moduleClass: string
	content: TModuleContent
}
export interface TModuleFullPage {
	'page-top'?: TModuleAllContent[]
	'page-bottom'?: TModuleAllContent[]
	'content-top'?: TModuleAllContent[]
	'content-bottom'?: TModuleAllContent[]
}
export interface TModulePage {
	'page-top'?: TModulePageContent[]
	'page-bottom'?: TModulePageContent[]
	'content-top'?: TModulePageContent[]
	'content-bottom'?: TModulePageContent[]
}
export interface TModules {
	[key: string]: TModulePage
}
export interface TModulesFull {
	[key: string]: TModuleFullPage
}
export interface TModulePageResponse {
	success: number
	content: TModulePage
}

export interface TSettings
	extends Record<
		string,
		| string
		| Record<string, string>
		| Record<string, string>[]
		| Record<string, TFooterIcon>
	> {
	footer_icons: Record<string, TFooterIcon>
	phoneMasks: Record<string, string>
	mainSettings: Record<string, string>
	phoneMasksArr: TPhoneMask[]
}

export interface TShoppingCart {
	products: TCartProduct[]
	total: number
	total_str: string
	count: number
	weight: number
	weight_str: string
	stock: boolean
	shipping: boolean
	totals: TCartTotal[]
	deliveries: TDelivery[]
	current_delivery: TCurrentCartAction
	payments: TPayment[]
	current_payment: TCurrentCartAction
	customer_data: TUser
	customer_address: TAddress
}

export interface TGlobals {
	lang_settings: Record<string, string> | null
	translations: Record<string, string> | null
	languages: TLanguage[] | null
	currency: TCurrencyData | null
	modules: TModulesFull | null
	settings: TSettings | null
	user: TUser | null
	favourites: TProduct[]
	compares: TProduct[]
}

export interface TSettingsResponse {
	success: number
	globals: TGlobals
	cart: TShoppingCart
}

export type TPageChangeHandler = (page: number) => void

export type TRequestQuery = Record<
	string,
	string | string[] | number | undefined
>

// Articles

type TArticleImage = {
	id: number
	image: string
	thumb?: string
	thumb_big?: string
	thumb_gallery?: string
}
export interface TBlogCategory {
	id: number
	name: string
	alias: string
	image: string
	preview: string
	description: string
	thumb: string
	parent_path: string
}
export interface TBlogArticle {
	id: number
	alias: string
	updated_at: string
	name: string
	image: string
	thumb: string
	preview: string
	description: string
	images: TArticleImage[]
	products: TProduct[]
	tag: string
	meta_title: string
	meta_h1: string
	meta_description: string
	meta_keyword: string
}

export interface TBlogArticles {
	list: TBlogArticle[]
	page: number
	count: number
	limit: number
}
