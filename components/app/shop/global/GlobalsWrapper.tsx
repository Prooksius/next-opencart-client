import { Provider, useSelector } from 'react-redux'
import { listTooltipShow } from '@/store/slices/globalsSlice'
import { ReactNode, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import { ToastContainer } from 'react-toastify'

interface GlobalsWrapperProps {
	children: ReactNode
}

export const GlobalsWrapper = ({ children }: GlobalsWrapperProps) => {
	const tooltipShow = useSelector(listTooltipShow)

	useEffect(() => {
		ReactTooltip.rebuild()
		// eslint-disable-next-line
	}, [])

	return (
		<>
			{children}
			{tooltipShow && (
				<>
					<ReactTooltip
						id="for-bottom"
						html={true}
						effect="solid"
						place="bottom"
					/>
					<ReactTooltip id="for-top" html={true} effect="solid" place="top" />
				</>
			)}
			<ToastContainer position="top-right" autoClose={2000} theme={'colored'} />
		</>
	)
}
