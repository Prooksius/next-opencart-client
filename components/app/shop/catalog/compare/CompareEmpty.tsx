import Link from 'next/link'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

interface CompareEmptyProps {
	emptyText: string
	link: string
}

export const CompareEmpty = ({ emptyText, link }: CompareEmptyProps) => {
	return (
		<div className="compare-empty">
			<div className="_container">
				<Link href={link}>
					<a className="compare-empty__link">
						<span className="compare-empty__link-icon">
							<AddCircleOutlineIcon />
						</span>
						<span>{emptyText}</span>
					</a>
				</Link>
			</div>
		</div>
	)
}
