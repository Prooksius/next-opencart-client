import { ReactNode, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
	isFiltersHeightChanged,
	clearFiltersHeightChanged,
	isProductFiltersChanged,
} from '@/store/slices/categoriesSlice'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'

interface TGSAPSettings {
	start: string | ((self?: any) => string)
	end: string | ((self?: any) => string)
	onRefresh?: (self: any) => void
	onRefreshInit?: (self: any) => void
	onUpdate?: (self: any) => void
	trigger?: string
	endTrigger?: string
	kill?: () => void
}

interface StikySidebarWrapperProps {
	children: ReactNode
	contentId: string
}

export const StikySidebarWrapper = ({
	children,
	contentId,
}: StikySidebarWrapperProps) => {
	const [sideBarST, setSideBarST] = useState<any | null>(null)
	const dispatch = useDispatch<AppDispatch>()
	const prodsFiltersChanged = useSelector(isProductFiltersChanged)
	const filtersHeightChanged = useSelector(isFiltersHeightChanged)

	if (typeof window !== `undefined`) {
		gsap.registerPlugin(ScrollTrigger)
  }
  
	const stickyBothDirections = (element: string, vars: TGSAPSettings) => {
		if (!element) {
			return false
		}

		vars = vars || {}
		const elementInner = gsap.utils.toArray<HTMLElement>(element)[0]
		if (!element) {
			return false
		}
		const endTriggerElement = gsap.utils.toArray<HTMLElement>(
			vars.endTrigger!
		)[0]
		let keywords: Record<string, string> = {
				top: '0',
				center: '50%',
				bottom: '100%',
			},
			scrollFunc = ScrollTrigger.getScrollFunc(window),
			overlap: number,
			topOffset: string | number,
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
					elementInner.offsetHeight - window.innerHeight + Number(topOffset)
				)
			},
			{ onUpdate, onRefresh } = vars,
			offset = 0,
			lastY = 0,
			pinned: boolean,
			pin = (value: boolean, bottom: boolean = false) => {
				pinned = value
				if (pinned) {
					let bounds = elementInner.getBoundingClientRect()
					gsap.set(elementInner, {
						position: 'fixed',
						left: bounds.left,
						width: bounds.width,
						boxSizing: 'border-box',
						y: 0,
						top: bottom ? Number(topOffset) - overlap : topOffset,
					})
				} else {
					gsap.set(elementInner, {
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
		vars.onRefreshInit = (self: any) => {
			self.progress = 0
			self.isActive = false
			vars.onUpdate && vars.onUpdate(self)
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
						endTriggerElement.offsetHeight > elementInner.offsetHeight,
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
