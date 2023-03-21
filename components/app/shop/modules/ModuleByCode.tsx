import { TModuleContent } from 'types'
import { _modulesList } from './_modulesList'

interface ModulesByCodeProps {
	code: string
	content: TModuleContent
}

export const ModuleByCode = ({ code, content }: ModulesByCodeProps) => {
	if (!content) {
		return null
	}

	const moduleRender = (moduleCode: string, localContent: TModuleContent) => {
		const Module = _modulesList[moduleCode]
		return <Module content={localContent} />
	}

	return <>{moduleRender(code, content)}</>
}
