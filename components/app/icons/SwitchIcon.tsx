export interface SwitchIconProps {
	active: boolean
	doSwitch: (condition: boolean) => void
}
export const SwitchIcon = ({ active, doSwitch }: SwitchIconProps) => {
	return (
		<div
			className="icon-tooltip-container pointer"
			onClick={(event) => doSwitch(!active)}
			title={'В' + (active ? 'ы' : '') + 'ключить'}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="50"
				height="30"
				viewBox="0 0 22.4 12.5"
			>
				<path
					className="transition-figure"
					d="M16.2,1.3h-10c-2.8,0-5,2.2-5,5s2.2,5,5,5h10c2.8,0,5-2.2,5-5S18.9,1.3,16.2,1.3"
					fill={active ? 'green' : 'grey'}
				/>
				<circle
					className="transition-figure"
					cx={active ? 15.8 : 6.5}
					cy="6.3"
					r="3"
					fill="#ffffff"
				/>
			</svg>
		</div>
	)
}
