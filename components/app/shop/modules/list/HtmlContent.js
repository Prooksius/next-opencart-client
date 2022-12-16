import classNames from 'classnames'
import { LoadingPlaceholder } from '@/components/app/shop/LoadingPlaceholder'

export const HtmlContent = ({ content }) => {
	if (!content) {
		return <LoadingPlaceholder />
	}

  return (
		<div
			className="seo-text__content"
			dangerouslySetInnerHTML={{
				__html: content,
			}}
		></div>
	)
}
