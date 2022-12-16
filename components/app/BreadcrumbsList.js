import Link from 'next/link'
import React from 'react'
import { listTranslations } from '@/store/slices/globalsSlice'
import { useSelector } from 'react-redux'

export const BreadcrumbsList = ({ breadcrumbs }) => {
	const translations = useSelector(listTranslations)

	return (
		<div className="breadcrumbs">
			<div
				className="breadcrumbs__wrapper"
				itemScope=""
				itemType="http://schema.org/BreadcrumbList"
			>
				<span
					className="breadcrumbs__link"
					itemProp="itemListElement"
					itemScope=""
					itemType="http://schema.org/ListItem"
				>
					<Link className="breadcrumb__link" href="/">
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
								itemScope=""
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
