import { Provider, useSelector } from 'react-redux'
import { listTooltipShow } from '@/store/slices/globalsSlice'
import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import { ToastContainer } from 'react-toastify'

export const GlobalsWrapper = (props) => {
	const tooltipShow = useSelector(listTooltipShow)

	useEffect(() => {
		ReactTooltip.rebuild()
		// eslint-disable-next-line
	}, [])

	return (
		<>
			{props.children}
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
