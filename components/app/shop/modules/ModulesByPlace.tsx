import { _modulesList } from './_modulesList'
import { useSelector } from 'react-redux'
import { listModulesByPosition } from '@/store/slices/globalsSlice'
import { TModulePage, TModulePosition } from 'types'
import { getNewID } from '@/config'

interface ModulesByPlaceProps {
	pageCode: string
	position: TModulePosition
	content?: TModulePage | null
}

export const ModulesByPlace = ({
	pageCode,
	position,
	content = null,
}: ModulesByPlaceProps) => {
	const modulesList = useSelector(listModulesByPosition)

	let found = false
	if (modulesList(pageCode, position)?.length) found = true

	if (!content && !found) {
		return null
	}

	const moduleRender = (moduleCode: string, settings: any, index: number) => {
		const Module = _modulesList[moduleCode]
		const moduleContent =
			content &&
			content[position]?.find((item) => item.moduleClass === moduleCode)
				?.content
		return (
			<Module
				content={moduleContent ? moduleContent : null}
				settings={settings}
				localKey={position}
				key={position + '-' + index}
			/>
		)
	}

	return (
		<>
			{modulesList(pageCode, position)?.map((data, index) =>
				moduleRender(data.moduleClass, data.settings, index)
			)}
		</>
	)
}
