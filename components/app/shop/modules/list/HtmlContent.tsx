import { LoadingPlaceholder } from '@/components/app/shop/global/LoadingPlaceholder'

interface HtmlContentProps {
	content: string
}

export const HtmlContent = ({ content }: HtmlContentProps) => {
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
