import Link from 'next/link'
import React from 'react'
import { listTranslations } from '@/store/slices/globalsSlice'
import { useSelector } from 'react-redux'
import { TBreadcrumb } from 'types'

interface BreadcrumbsListProps {
	breadcrumbs: TBreadcrumb[]
}

export const BreadcrumbsList = ({ breadcrumbs }: BreadcrumbsListProps) => {
	const translations = useSelector(listTranslations)

	return (
		<div className="breadcrumbs">
			<div
				className="breadcrumbs__wrapper"
				itemScope={false}
				itemType="http://schema.org/BreadcrumbList"
			>
				<span
					className="breadcrumbs__link"
					itemProp="itemListElement"
					itemScope={false}
					itemType="http://schema.org/ListItem"
				>
					<Link href="/">
						<a className="breadcrumb__link" itemProp="item">
							<span itemProp="name">{translations('Home')}</span>
						</a>
					</Link>
				</span>
				<span className="breadcrumbs__separator"></span>
				{breadcrumbs &&
					breadcrumbs.map((item, index) => (
						<React.Fragment key={index}>
							<span
								className="breadcrumbs__link"
								itemProp="itemListElement"
								itemScope={false}
								itemType="http://schema.org/ListItem"
							>
								{item.href && (
									<Link href={item.href}>
										<a className="breadcrumb__link" itemProp="item">
											<span itemProp="name">{item.title}</span>
										</a>
									</Link>
								)}
								{!item.href && (
									<span className="breadcrumbs__title">{item.title}</span>
								)}
							</span>
							{item.href && <span className="breadcrumbs__separator"></span>}
						</React.Fragment>
					))}
			</div>
		</div>
	)
}
