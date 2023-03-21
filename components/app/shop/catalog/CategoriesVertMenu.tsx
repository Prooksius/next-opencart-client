import { useSelector } from 'react-redux'
import { FilterBlock } from './FilterBlock'
import { CategoryChilds } from './CategoryChilds'
import { StikySidebarWrapper } from '@/components/app/shop/global/StikySidebarWrapper'
import {
	listFilters,
	listCategoriesLoaded,
} from '@/store/slices/categoriesSlice'

interface CategoriesVertMenuProps {
	contentId: string
}

export const CategoriesVertMenu = ({ contentId }: CategoriesVertMenuProps) => {
	const filters = useSelector(listFilters)
	const catsLoaded = useSelector(listCategoriesLoaded)

	return (
		<aside className="catalog__left-filter">
			<StikySidebarWrapper contentId={contentId}>
				{catsLoaded && <CategoryChilds />}
				{catsLoaded && filters && <FilterBlock />}
			</StikySidebarWrapper>
		</aside>
	)
}
