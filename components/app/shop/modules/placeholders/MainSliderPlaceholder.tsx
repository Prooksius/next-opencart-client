import { getNewID, getRandomCode } from 'config'
import range from 'lodash.range'
import { MainSliderSettings } from 'types'

interface MainSliderPlaceholderProps {
	settings: MainSliderSettings
	localKey: string
}

export const MainSliderPlaceholder = ({
	settings,
	localKey,
}: MainSliderPlaceholderProps) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				marginBottom: '35px',
				gap: '35px',
			}}
		>
			<span
				className="skeleton-box angle-left"
				style={{
					width: '50px',
					minWidth: '50px',
					height: '50px',
					minHeight: '50px',
					transform: 'scale(0.6) rotate(45deg)',
				}}
			></span>
			{parseInt(settings.visible) === 1 && (
				<span
					className="skeleton-box single"
					style={{
						width: settings.width + 'px',
						paddingBottom:
							Number(
								(parseInt(settings.height) / parseInt(settings.width)) * 100 -
									14
							) + '%',
					}}
				></span>
			)}
			{parseInt(settings.visible) > 1 &&
				range(parseInt(settings.visible)).map((item) => (
					<span
						className="skeleton-box"
						key={`${localKey}-sliderPH-${item}`}
						style={{
							width: settings.width + 'px',
							aspectRatio: '1 / 1',
							height: '100%',
						}}
					></span>
				))}
			<span
				className="skeleton-box angle-left"
				style={{
					width: '50px',
					minWidth: '50px',
					height: '50px',
					minHeight: '50px',
					transform: 'scale(0.6) rotate(-135deg)',
				}}
			></span>
		</div>
	)
}
