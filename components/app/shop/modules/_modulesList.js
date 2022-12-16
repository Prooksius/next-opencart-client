import classNames from 'classnames'
import { HtmlContent } from './list/HtmlContent'
import { MainSlider } from './list/MainSlider'
import { FeaturedProducts } from './list/FeaturedProducts'

export const _modulesList = {
	HtmlContent,
	MainSlider,
	FeaturedProducts,
	LookedProducts: FeaturedProducts,
	SpecialProducts: FeaturedProducts,
}
