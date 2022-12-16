import { useSelector } from 'react-redux'
import { FilterBlock } from './FilterBlock'
import { CategoryChilds } from './CategoryChilds'
import { StikySidebarWrapper } from '@/components/app/StikySidebarWrapper'
import {
	listCurrent,
	listChilds,
	listFilters,
	listCategoriesLoaded,
} from '@/store/slices/categoriesSlice'

export const CategoriesVertMenu = ({ contentId }) => {
	const childsList = useSelector(listChilds)
	const filters = useSelector(listFilters)
	const catsLoaded = useSelector(listCategoriesLoaded)

	return (
		<aside className="catalog__left-filter">
			<StikySidebarWrapper contentId={contentId}>
				{catsLoaded && childsList.length > 0 && <CategoryChilds />}
				{catsLoaded && filters && <FilterBlock />}
			</StikySidebarWrapper>
		</aside>
	)
}
