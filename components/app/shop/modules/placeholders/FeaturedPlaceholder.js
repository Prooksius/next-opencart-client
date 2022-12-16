export const FeaturedPlaceholder = ({ settings }) => {
	const list = Array.from(Array(Number(settings.visible)).keys())
	console.log('settings', settings)
	return (
		<>
			<p>
				<span
					className="skeleton-box"
					style={{ width: '300px', height: '30px', marginBottom: '25px' }}
				></span>
			</p>
			<div
				style={{
					display: 'flex',
					gap: '25px',
					marginBottom: '35px',
				}}
			>
				{list.map((i) => (
					<span
						className="skeleton-box"
						key={i + 'ph'}
						style={{
							width: 100 / list.length + '%',
							paddingBottom: '450px',
						}}
					></span>
				))}
			</div>
		</>
	)
}
