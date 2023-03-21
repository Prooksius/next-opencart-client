import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y, Controller } from 'swiper'
import { REACT_APP_IMAGE_URL } from 'config'
import {
	removeFromCompares,
	TProduct,
	TProductAttribute,
	TProductAttributeGroup,
} from '@/store/slices/productsSlice'
import useScreenSize from '../../hooks/useScreenSize'
import { listTranslations } from '@/store/slices/globalsSlice'
import { useDispatch, useSelector } from 'react-redux'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { useState, useEffect } from 'react'
import range from 'lodash.range'
import {
	getCookie,
	checkCookies,
	setCookies,
	removeCookies,
} from 'cookies-next'
import { AppDispatch } from '@/store/store'
import { RenderPrices } from './compare/RenderPrices'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Collapse } from 'react-collapse'

interface CompareSliderProps {
	products: TProduct[] | null
}

export const CompareSlider = ({ products }: CompareSliderProps) => {
	const dispatch = useDispatch<AppDispatch>()
	const translations = useSelector(listTranslations)
	const [picHeight, setPicHeight] = useState<string>('auto')

	const [leftCompareSwipers, setLeftCompareSwipers] = useState<any[]>([])
	const [rightCompareSwipers, setRightCompareSwipers] = useState<any[]>([])

	const [accordionOpens, setAccordionOpens] = useState<Array<string>>([])

	const { width } = useScreenSize()

	useEffect(() => {
		setPicHeight('245px')
	}, [])

	if (!width || !products || !products.length) {
		return null
	}

	const allAttributes: TProductAttribute[] = []
	products.map((product) => {
		product.attributes.map((group) => {
			group.attribute.map((attr) => {
				if (
					!allAttributes.find(
						(allAttr) => allAttr.attribute_id === attr.attribute_id
					)
				) {
					allAttributes.push(attr)
				}
			})
		})
	})

	const getProductAttrValue = (
		attributes: TProductAttributeGroup[],
		attribute_id: number
	): string => {
		let ret_value = '&nbsp;'
		for (var i = 0; i < attributes.length; i++) {
			for (var j = 0; j < attributes[i].attribute.length; j++) {
				if (attributes[i].attribute[j].attribute_id === attribute_id) {
					ret_value = attributes[i].attribute[j].text
					break
				}
			}
		}
		return ret_value
	}

	const removeFromCompare = (id: number) => {
		let save = false
		let removeId: string | undefined = undefined
		let compares: string[] = []
		if (checkCookies('compareProducts')) {
			const comparesStr = getCookie('compareProducts')
			compares = JSON.parse(typeof comparesStr === 'string' ? comparesStr : '')
			if (compares.constructor !== Array) {
				compares = []
			}
		}
		compares = compares.filter((item) => +item !== id)
		removeId = id.toString()
		save = true
		const today = new Date()
		setCookies('compareProducts', JSON.stringify(compares), {
			expires: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 7),
			sameSite: 'lax',
		})
		dispatch(removeFromCompares(+removeId))
	}

	const MobileTopSlide = ({ product }: { product: TProduct }) => {
		return (
			<div className="compare-product__wrapper">
				<div className="compare-product__item">
					<Link href={`/product/${product.alias}`}>
						<a className="compare-product__image">
							<span className="image-inner">
								<Image
									src={REACT_APP_IMAGE_URL + product.thumb}
									alt={product.name}
									width={'300px'}
									height={'300px'}
									objectFit="contain"
								/>
							</span>
						</a>
					</Link>
					<Link href={`/product/${product.alias}`}>
						<a className="compare-product__title">{product.short_name}</a>
					</Link>
					<div className="compare-product__item-controls">
						<button type="button" className="compare-product__item-add">
							<ShoppingCartIcon />
						</button>
						<button
							type="button"
							className="compare-product__item-remove"
							onClick={() => removeFromCompare(product.id)}
						>
							<HighlightOffIcon />
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<>
			{typeof width === undefined ||
				(width > 1023 && (
					<div className="compare__desktop">
						<div className="compare__row">
							<div className="compare__heading">
								<div
									className="compare-product__item"
									style={{ height: picHeight }}
								></div>
								<div className="compare-product__attributes">
									<div className="compare-product__attribute">
										{translations('ProductPrice')}
									</div>
									<div className="compare-product__attribute">
										{translations('ProductModel')}
									</div>
									<div className="compare-product__attribute">
										{translations('ProductRating')}
									</div>
									<div className="compare-product__attribute">
										{translations('ProductWeight')}
									</div>
									<div className="compare-product__attribute">
										{translations('ProductDimensions')}
									</div>
									{allAttributes.map((attr) => (
										<div
											className="compare-product__attribute"
											key={attr.attribute_id}
										>
											{attr.name}
										</div>
									))}
									<div className="compare-product__attribute">
										{translations('ProductBrand')}
									</div>
								</div>
							</div>
							<div className="compare__items">
								<Swiper
									spaceBetween={50}
									slidesPerView={Math.min(products.length, 3)}
									// onSlideChange={() => console.log('slide change')}
									// onSwiper={(swiper) => setImageHeight()}
								>
									{products.map((product) => (
										<SwiperSlide className="compare-product" key={product.id}>
											<div className="compare-product__wrapper">
												<div
													className="compare-product__item"
													style={{ height: picHeight }}
												>
													<Link href={`/product/${product.alias}`}>
														<a className="compare-product__image">
															<span className="image-inner">
																<Image
																	src={REACT_APP_IMAGE_URL + product.thumb}
																	alt={product.name}
																	width={'300px'}
																	height={'300px'}
																	objectFit="contain"
																/>
															</span>
														</a>
													</Link>
													<Link href={`/product/${product.alias}`}>
														<a className="compare-product__title">
															{product.short_name}
														</a>
													</Link>
													<button
														type="button"
														className="compare-product__item-remove"
														onClick={() => removeFromCompare(product.id)}
													>
														<HighlightOffIcon />
													</button>
												</div>
												<div className="compare-product__attributes">
													<div className="compare-product__attribute">
														<RenderPrices product={product} />
													</div>
													<div className="compare-product__attribute">
														{product.model}
													</div>
													<div className="compare-product__attribute">
														{range(5).map((item) => (
															<div key={'star-' + item}>
																{product.rating < item && (
																	<StarBorderIcon color="warning" />
																)}
																{product.rating >= item && (
																	<StarIcon color="warning" />
																)}
															</div>
														))}
													</div>
													<div className="compare-product__attribute">
														{product.weight_str}
													</div>
													<div className="compare-product__attribute">
														{product.length_str} x {product.width_str} x{' '}
														{product.height_str}
													</div>
													{allAttributes.map((allAttr, index) => (
														<div
															className="compare-product__attribute"
															key={index}
															dangerouslySetInnerHTML={{
																__html: getProductAttrValue(
																	product.attributes,
																	allAttr.attribute_id
																),
															}}
														></div>
													))}
													<div className="compare-product__attribute">
														{product.manufacturer}
													</div>
												</div>
											</div>
										</SwiperSlide>
									))}
								</Swiper>
							</div>
						</div>
					</div>
				))}
			{width <= 1023 && (
				<div className="compare__mobile">
					<div className="compare__mobile-sliders">
						<div className="compare__mobile-slider compare__mobile-slider--left">
							<Swiper
								className="swiper"
								modules={[Controller, Pagination]}
								spaceBetween={10}
								slidesPerView={1}
								pagination={{
									type: 'fraction',
								}}
								controller={{
									control: leftCompareSwipers,
								}}
							>
								{products.map((product) => (
									<SwiperSlide
										className="compare-product"
										key={'left-' + product.id}
									>
										<MobileTopSlide product={product} />
									</SwiperSlide>
								))}
							</Swiper>
						</div>
						<div className="compare__mobile-slider compare__mobile-slider--right">
							<Swiper
								className="swiper"
								modules={[Controller, Pagination]}
								spaceBetween={10}
								slidesPerView={1}
								pagination={{
									type: 'fraction',
								}}
								controller={{
									control: rightCompareSwipers,
								}}
							>
								{products.map((product) => (
									<SwiperSlide
										className="compare-product"
										key={'right-' + product.id}
									>
										<MobileTopSlide product={product} />
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					</div>
					<div className="compare__mobile-attributes accordion _init">
						<div className="accordion__item">
							<button
								tabIndex={-1}
								type="button"
								style={{ height: 0 }}
								className={classNames(
									'compare-product__attribute compare-product__attribute--height accordion__title',
									{ _active: accordionOpens.includes('price') }
								)}
								onClick={() =>
									setAccordionOpens((old) => {
										if (old.includes('price')) {
											return old.filter((item) => item !== 'price')
										}
										return [...old, 'price']
									})
								}
							>
								<span>{translations('ProductPrice')}</span>
							</button>
							<Collapse isOpened={accordionOpens.includes('price')}>
								<div className="accordion__text">
									<div className="compare__attributes-sliders">
										<div className="compare__attributes-slider compare__attributes-slider--left">
											<Swiper
												modules={[Controller]}
												slidesPerView={1}
												spaceBetween={10}
												watchOverflow
												observer
												observeParents
												observeSlideChildren
												allowTouchMove
												onSwiper={(swiper) =>
													setLeftCompareSwipers((old) => [...old, swiper])
												}
											>
												{products.map((product) => (
													<SwiperSlide key={'prices-left-' + product.id}>
														<RenderPrices product={product} />
													</SwiperSlide>
												))}
											</Swiper>
										</div>
										<div className="compare__attributes-slider compare__attributes-slider--right">
											<Swiper
												modules={[Controller]}
												slidesPerView={1}
												spaceBetween={10}
												watchOverflow
												observer
												observeParents
												observeSlideChildren
												allowTouchMove
												onSwiper={(swiper) =>
													setRightCompareSwipers((old) => [...old, swiper])
												}
											>
												{products.map((product) => (
													<SwiperSlide key={'prices-right-' + product.id}>
														<RenderPrices product={product} />
													</SwiperSlide>
												))}
											</Swiper>
										</div>
									</div>
								</div>
							</Collapse>
						</div>
						<div className="accordion__item">
							<button
								tabIndex={-1}
								type="button"
								style={{ height: 0 }}
								className={classNames(
									'compare-product__attribute compare-product__attribute--height accordion__title',
									{ _active: accordionOpens.includes('model') }
								)}
								onClick={() =>
									setAccordionOpens((old) => {
										if (old.includes('model')) {
											return old.filter((item) => item !== 'model')
										}
										return [...old, 'model']
									})
								}
							>
								<span>{translations('ProductModel')}</span>
							</button>
							<Collapse isOpened={accordionOpens.includes('model')}>
								<div className="accordion__text">
									<div className="compare__attributes-sliders">
										<div className="compare__attributes-slider compare__attributes-slider--left">
											<Swiper
												modules={[Controller]}
												slidesPerView={1}
												spaceBetween={10}
												watchOverflow
												observer
												observeParents
												observeSlideChildren
												allowTouchMove
												onSwiper={(swiper) =>
													setLeftCompareSwipers((old) => [...old, swiper])
												}
											>
												{products.map((product) => (
													<SwiperSlide key={'model-left-' + product.id}>
														{product.model}
													</SwiperSlide>
												))}
											</Swiper>
										</div>
										<div className="compare__attributes-slider compare__attributes-slider--right">
											<Swiper
												modules={[Controller]}
												slidesPerView={1}
												spaceBetween={10}
												watchOverflow
												observer
												observeParents
												observeSlideChildren
												allowTouchMove
												onSwiper={(swiper) =>
													setRightCompareSwipers((old) => [...old, swiper])
												}
											>
												{products.map((product) => (
													<SwiperSlide key={'model-right-' + product.id}>
														{product.model}
													</SwiperSlide>
												))}
											</Swiper>
										</div>
									</div>
								</div>
							</Collapse>
						</div>
						<div className="accordion__item">
							<button
								tabIndex={-1}
								type="button"
								style={{ height: 0 }}
								className={classNames(
									'compare-product__attribute compare-product__attribute--height accordion__title',
									{ _active: accordionOpens.includes('rating') }
								)}
								onClick={() =>
									setAccordionOpens((old) => {
										if (old.includes('rating')) {
											return old.filter((item) => item !== 'rating')
										}
										return [...old, 'rating']
									})
								}
							>
								<span>{translations('ProductRating')}</span>
							</button>
							<Collapse isOpened={accordionOpens.includes('rating')}>
								<div className="accordion__text">
									<div className="compare__attributes-sliders">
										<div className="compare__attributes-slider compare__attributes-slider--left">
											<Swiper
												modules={[Controller]}
												slidesPerView={1}
												spaceBetween={10}
												watchOverflow
												observer
												observeParents
												observeSlideChildren
												allowTouchMove
												onSwiper={(swiper) =>
													setLeftCompareSwipers((old) => [...old, swiper])
												}
											>
												{products.map((product) => (
													<SwiperSlide key={'stars-left-' + product.id}>
														{range(5).map((item) => (
															<div key={product.id + '-stars-left-' + item}>
																{product.rating < item && (
																	<StarBorderIcon color="warning" />
																)}
																{product.rating >= item && (
																	<StarIcon color="warning" />
																)}
															</div>
														))}
													</SwiperSlide>
												))}
											</Swiper>
										</div>
										<div className="compare__attributes-slider compare__attributes-slider--right">
											<Swiper
												modules={[Controller]}
												slidesPerView={1}
												spaceBetween={10}
												watchOverflow
												observer
												observeParents
												observeSlideChildren
												allowTouchMove
												onSwiper={(swiper) =>
													setRightCompareSwipers((old) => [...old, swiper])
												}
											>
												{products.map((product) => (
													<SwiperSlide key={'stars-right-' + product.id}>
														{range(5).map((item) => (
															<div key={product.id + '-stars-right-' + item}>
																{product.rating < item && (
																	<StarBorderIcon color="warning" />
																)}
																{product.rating >= item && (
																	<StarIcon color="warning" />
																)}
															</div>
														))}
													</SwiperSlide>
												))}
											</Swiper>
										</div>
									</div>
								</div>
							</Collapse>
						</div>
						<div className="accordion__item">
							<button
								tabIndex={-1}
								type="button"
								style={{ height: 0 }}
								className={classNames(
									'compare-product__attribute compare-product__attribute--height accordion__title',
									{ _active: accordionOpens.includes('weight') }
								)}
								onClick={() =>
									setAccordionOpens((old) => {
										if (old.includes('weight')) {
											return old.filter((item) => item !== 'weight')
										}
										return [...old, 'weight']
									})
								}
							>
								<span>{translations('ProductWeight')}</span>
							</button>
							<Collapse isOpened={accordionOpens.includes('weight')}>
								<div className="accordion__text">
									<div className="compare__attributes-sliders">
										<div className="compare__attributes-slider compare__attributes-slider--left">
											<Swiper
												modules={[Controller]}
												slidesPerView={1}
												spaceBetween={10}
												watchOverflow
												observer
												observeParents
												observeSlideChildren
												allowTouchMove
												onSwiper={(swiper) =>
													setLeftCompareSwipers((old) => [...old, swiper])
												}
											>
												{products.map((product) => (
													<SwiperSlide key={'weight-left-' + product.id}>
														{product.weight_str}
													</SwiperSlide>
												))}
											</Swiper>
										</div>
										<div className="compare__attributes-slider compare__attributes-slider--right">
											<Swiper
												modules={[Controller]}
												slidesPerView={1}
												spaceBetween={10}
												watchOverflow
												observer
												observeParents
												observeSlideChildren
												allowTouchMove
												onSwiper={(swiper) =>
													setRightCompareSwipers((old) => [...old, swiper])
												}
											>
												{products.map((product) => (
													<SwiperSlide key={'weight-right-' + product.id}>
														{product.weight_str}
													</SwiperSlide>
												))}
											</Swiper>
										</div>
									</div>
								</div>
							</Collapse>
						</div>
						<div className="accordion__item">
							<button
								tabIndex={-1}
								type="button"
								style={{ height: 0 }}
								className={classNames(
									'compare-product__attribute compare-product__attribute--height accordion__title',
									{ _active: accordionOpens.includes('dimensions') }
								)}
								onClick={() =>
									setAccordionOpens((old) => {
										if (old.includes('dimensions')) {
											return old.filter((item) => item !== 'dimensions')
										}
										return [...old, 'dimensions']
									})
								}
							>
								<span>{translations('ProductDimensions')}</span>
							</button>
							<Collapse isOpened={accordionOpens.includes('dimensions')}>
								<div className="accordion__text">
									<div className="compare__attributes-sliders">
										<div className="compare__attributes-slider compare__attributes-slider--left">
											<Swiper
												modules={[Controller]}
												slidesPerView={1}
												spaceBetween={10}
												watchOverflow
												observer
												observeParents
												observeSlideChildren
												allowTouchMove
												onSwiper={(swiper) =>
													setLeftCompareSwipers((old) => [...old, swiper])
												}
											>
												{products.map((product) => (
													<SwiperSlide key={'dimensions-left-' + product.id}>
														{product.length_str} x {product.width_str} x{' '}
														{product.height_str}
													</SwiperSlide>
												))}
											</Swiper>
										</div>
										<div className="compare__attributes-slider compare__attributes-slider--right">
											<Swiper
												modules={[Controller]}
												slidesPerView={1}
												spaceBetween={10}
												watchOverflow
												observer
												observeParents
												observeSlideChildren
												allowTouchMove
												onSwiper={(swiper) =>
													setRightCompareSwipers((old) => [...old, swiper])
												}
											>
												{products.map((product) => (
													<SwiperSlide key={'dimensions-right-' + product.id}>
														{product.length_str} x {product.width_str} x{' '}
														{product.height_str}
													</SwiperSlide>
												))}
											</Swiper>
										</div>
									</div>
								</div>
							</Collapse>
						</div>
						{allAttributes.map((allAttr, index) => (
							<div className="accordion__item" key={index}>
								<button
									tabIndex={-1}
									type="button"
									style={{ height: 0 }}
									className={classNames(
										'compare-product__attribute compare-product__attribute--height accordion__title',
										{ _active: accordionOpens.includes(allAttr.name) }
									)}
									onClick={() =>
										setAccordionOpens((old) => {
											if (old.includes(allAttr.name)) {
												return old.filter((item) => item !== allAttr.name)
											}
											return [...old, allAttr.name]
										})
									}
								>
									<span>{allAttr.name}</span>
								</button>
								<Collapse isOpened={accordionOpens.includes(allAttr.name)}>
									<div className="accordion__text">
										<div className="compare__attributes-sliders">
											<div className="compare__attributes-slider compare__attributes-slider--left">
												<Swiper
													modules={[Controller]}
													slidesPerView={1}
													spaceBetween={10}
													watchOverflow
													observer
													observeParents
													observeSlideChildren
													allowTouchMove
													onSwiper={(swiper) =>
														setLeftCompareSwipers((old) => [...old, swiper])
													}
												>
													{products.map((product) => (
														<SwiperSlide
															key={
																'attr-left-' +
																allAttr.attribute_id +
																'-' +
																product.id
															}
														>
															<span
																dangerouslySetInnerHTML={{
																	__html: getProductAttrValue(
																		product.attributes,
																		allAttr.attribute_id
																	),
																}}
															></span>
														</SwiperSlide>
													))}
												</Swiper>
											</div>
											<div className="compare__attributes-slider compare__attributes-slider--right">
												<Swiper
													modules={[Controller]}
													slidesPerView={1}
													spaceBetween={10}
													watchOverflow
													observer
													observeParents
													observeSlideChildren
													allowTouchMove
													onSwiper={(swiper) =>
														setRightCompareSwipers((old) => [...old, swiper])
													}
												>
													{products.map((product) => (
														<SwiperSlide
															key={
																'attr-right-' +
																allAttr.attribute_id +
																'-' +
																product.id
															}
														>
															<span
																dangerouslySetInnerHTML={{
																	__html: getProductAttrValue(
																		product.attributes,
																		allAttr.attribute_id
																	),
																}}
															></span>
														</SwiperSlide>
													))}
												</Swiper>
											</div>
										</div>
									</div>
								</Collapse>
							</div>
						))}
						<div className="accordion__item">
							<button
								tabIndex={-1}
								type="button"
								style={{ height: 0 }}
								className={classNames(
									'compare-product__attribute compare-product__attribute--height accordion__title',
									{ _active: accordionOpens.includes('brand') }
								)}
								onClick={() =>
									setAccordionOpens((old) => {
										if (old.includes('brand')) {
											return old.filter((item) => item !== 'brand')
										}
										return [...old, 'brand']
									})
								}
							>
								<span>{translations('ProductBrand')}</span>
							</button>
							<Collapse isOpened={accordionOpens.includes('brand')}>
								<div className="accordion__text">
									<div className="compare__attributes-sliders">
										<div className="compare__attributes-slider compare__attributes-slider--left">
											<Swiper
												modules={[Controller]}
												slidesPerView={1}
												spaceBetween={10}
												watchOverflow
												observer
												observeParents
												observeSlideChildren
												allowTouchMove
												onSwiper={(swiper) =>
													setLeftCompareSwipers((old) => [...old, swiper])
												}
											>
												{products.map((product) => (
													<SwiperSlide key={'brand-left-' + product.id}>
														{product.manufacturer}
													</SwiperSlide>
												))}
											</Swiper>
										</div>
										<div className="compare__attributes-slider compare__attributes-slider--right">
											<Swiper
												modules={[Controller]}
												slidesPerView={1}
												spaceBetween={10}
												watchOverflow
												observer
												observeParents
												observeSlideChildren
												allowTouchMove
												onSwiper={(swiper) =>
													setRightCompareSwipers((old) => [...old, swiper])
												}
											>
												{products.map((product) => (
													<SwiperSlide key={'brand-right-' + product.id}>
														{product.manufacturer}
													</SwiperSlide>
												))}
											</Swiper>
										</div>
									</div>
								</div>
							</Collapse>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
