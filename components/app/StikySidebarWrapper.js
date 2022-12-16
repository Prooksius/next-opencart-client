import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
	isFiltersHeightChanged,
	clearFiltersHeightChanged,
	isProductFiltersChanged,
} from '@/store/slices/categoriesSlice'
import { useSelector, useDispatch } from 'react-redux'

export const StikySidebarWrapper = ({ children, contentId }) => {
	const [sideBarST, setSideBarST] = useState(null)
	const dispatch = useDispatch()
	const prodsFiltersChanged = useSelector(isProductFiltersChanged)
	const filtersHeightChanged = useSelector(isFiltersHeightChanged)

	if (typeof window !== `undefined`) {
		gsap.registerPlugin(ScrollTrigger)
		gsap.core.globals('ScrollTrigger', ScrollTrigger)
	}

	const stickyBothDirections = (element, vars) => {
		if (!element) {
			return false
		}

		vars = vars || {}
		element = gsap.utils.toArray(element)[0]
		if (!element) {
			return false
		}
		const endTriggerElement = gsap.utils.toArray(vars.endTrigger)[0]
		let keywords = { top: '0', center: '50%', bottom: '100%' },
			scrollFunc = ScrollTrigger.getScrollFunc(window),
			overlap,
			topOffset,
			updateOverlap = () => {
				topOffset =
					(
						(typeof vars.start === 'function'
							? vars.start()
							: vars.start || '0 0') + ''
					).split(' ')[1] || '0'
				topOffset = keywords[topOffset] || topOffset
				topOffset = ~topOffset.indexOf('%')
					? (parseFloat(topOffset) / 100) * window.innerHeight
					: parseFloat(topOffset) || 0
				overlap = Math.max(
					0,
					element.offsetHeight - window.innerHeight + topOffset
				)
			},
			{ onUpdate, onRefresh } = vars,
			offset = 0,
			lastY = 0,
			pinned,
			pin = (value, bottom) => {
				pinned = value
				if (pinned) {
					let bounds = element.getBoundingClientRect()
					gsap.set(element, {
						position: 'fixed',
						left: bounds.left,
						width: bounds.width,
						boxSizing: 'border-box',
						y: 0,
						top: bottom ? topOffset - overlap : topOffset,
					})
				} else {
					gsap.set(element, {
						position: 'relative',
						clearProps: 'left,top,width,boxSizing',
						y: offset,
					})
				}
			},
			self

		updateOverlap()
		vars.trigger = element
		vars.start = 'start' in vars ? vars.start : 'top top'
		vars.onRefresh = (self) => {
			updateOverlap()
			self.vars.onUpdate(self)
			onRefresh && onRefresh(self)
		}
		vars.onRefreshInit = (self) => {
			self.progress = 0
			self.isActive = false
			vars.onUpdate(self)
		}
		vars.onUpdate = (self) => {
			let { progress, start, end, isActive } = self,
				y = progress * (end - start),
				delta = y - lastY,
				exceedsBottom = y + Math.max(0, delta) >= overlap + offset
			if ((exceedsBottom || y + Math.min(0, delta) < offset) && isActive) {
				offset += exceedsBottom ? y - overlap - offset : y - offset
				pinned ||
					pin(
						endTriggerElement.offsetHeight > element.offsetHeight,
						exceedsBottom
					)
				// uncomment if you want to prioritize showing the TOP of the sidebar.
			} else if (!exceedsBottom && y + offset < overlap && isActive) {
				//   offset += y - offset;
				//   pinned || pin(true, false);
			} else if (pinned || !isActive) {
				isActive || (offset = y ? self.end - self.start - overlap : 0)
				pin(false)
			}
			lastY = y
			onUpdate && onUpdate(self)
		}
		self = ScrollTrigger.create(vars)
		return self
	}

	useEffect(() => {
		if (filtersHeightChanged) {
			console.log('sticky height changed')
			setTimeout(() => {
				if (sideBarST) {
					sideBarST.vars.onRefreshInit(sideBarST)
					sideBarST.kill()
				}
				setSideBarST(
					stickyBothDirections('#left-catalog-menu', {
						start: 'top 90px',
						endTrigger: contentId,
						end: (self) =>
							'bottom bottom' +
							(window.innerHeight - 90 > self.trigger.offsetHeight
								? '-=' + (window.innerHeight - self.trigger.offsetHeight - 90)
								: ''),
					})
				)
				dispatch(clearFiltersHeightChanged())
			}, 1000)
		}
		// eslint-disable-next-line
	}, [filtersHeightChanged])

	return (
		<div id="left-catalog-menu" className="sticky-sidebar left-catalog-menu">
			{children}
		</div>
	)
}
