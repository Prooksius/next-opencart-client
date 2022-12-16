import classNames from 'classnames'
import { _modulesList } from './_modulesList'
import { useSelector } from 'react-redux'
import { listModules } from '@/store/slices/globalsSlice'

export const ModulesByPlace = ({ pageCode, position, content }) => {
	const modulesList = useSelector(listModules)

	let found = false
	if (modulesList(pageCode, position)?.length) found = true

	if (!content && !found) {
		return ''
	}

	const moduleRender = (moduleCode, settings, index) => {
		const Module = _modulesList[moduleCode]
		const moduleContent = content?.find(
			(item) => item.moduleClass === moduleCode
		)?.content
		return (
			<Module
				content={moduleContent ? moduleContent : null}
				settings={settings}
				key={position + '-' + index}
			/>
		)
	}

	return (
		<>
			{modulesList(pageCode, position).map((data, index) =>
				moduleRender(data.moduleClass, data.settings, index)
			)}
		</>
	)
}
