export const MainSliderPlaceholder = ({ settings }) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				marginBottom: '35px',
			}}
		>
			<span
				className="skeleton-box angle-left"
				style={{
					width: '50px',
					height: '50px',
					transform: 'scale(0.6) rotate(45deg)',
				}}
			></span>
			<span
				className="skeleton-box"
				style={{
					width: settings.width + 'px',
					paddingBottom:
						Number((settings.height / settings.width) * 100 - 14) + '%',
				}}
			></span>
			<span
				className="skeleton-box angle-left"
				style={{
					width: '50px',
					height: '50px',
					transform: 'scale(0.6) rotate(-135deg)',
				}}
			></span>
		</div>
	)
}
