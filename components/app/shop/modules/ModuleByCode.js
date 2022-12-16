import classNames from 'classnames'
import { _modulesList } from './_modulesList'

export const ModuleByCode = ({ code, content }) => {
	if (!content) {
		return ''
	}

	const moduleRender = (moduleCode, content) => {
		const Module = _modulesList[moduleCode]
		return <Module content={content} />
	}

	return <>{moduleRender(code, content)}</>
}
