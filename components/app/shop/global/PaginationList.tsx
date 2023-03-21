import { createSlot } from 'react-slotify'
import classNames from 'classnames'
import ReactPaginate from 'react-paginate'
import { TPageChangeHandler, TStatus } from 'types'
import { ReactNode } from 'react'

export const HeaderSlot = createSlot()
export const SortSlot = createSlot()
export const FooterSlot = createSlot()

interface PaginationListProps {
	title?: string
	itemsInPage: number
	itemsCount: number
	loadedPage: number
	containerClass: string
	listClass: string
	listStatus: TStatus
	pageChangedCallback: TPageChangeHandler
	children: ReactNode
}

const PaginationList = (props: PaginationListProps) => {
	const totalPages = Math.ceil(props.itemsCount / props.itemsInPage)

	// Invoke when user click to request another page.
	const handlePageClick = (payload: { selected: number }) => {
		const newPage = payload.selected + 1
		if (props.loadedPage !== newPage) {
			console.log(`User requested page number ${newPage}`)
			if (props.pageChangedCallback) props.pageChangedCallback(+newPage)
		}
	}

	return (
		<>
			<div className={classNames(props.containerClass, 'items-container')}>
				<HeaderSlot.Renderer childs={props.children}>
					{props.title !== '' && <h3>{props.title}</h3>}
				</HeaderSlot.Renderer>
				<SortSlot.Renderer childs={props.children} />
				<div
					className={classNames('item-list', props.listClass, {
						loading: props.listStatus === 'loading',
					})}
				>
					{props.children}
				</div>
				{totalPages > 1 && (
					<ReactPaginate
						breakLabel="…"
						nextLabel=">"
						forcePage={props.loadedPage - 1}
						disableInitialCallback={true}
						onPageChange={handlePageClick}
						pageRangeDisplayed={3}
						marginPagesDisplayed={4}
						pageCount={totalPages}
						previousLabel="<"
						pageClassName="page-item"
						pageLinkClassName="page-link"
						previousClassName="page-item previous"
						previousLinkClassName="page-link"
						nextClassName="page-item next"
						nextLinkClassName="page-link"
						breakClassName="page-item"
						breakLinkClassName="page-link"
						containerClassName="pagination"
						activeClassName="active"
					/>
				)}
				<FooterSlot.Renderer childs={props.children} />
			</div>
		</>
	)
}

export default PaginationList
