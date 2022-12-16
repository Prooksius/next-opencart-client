import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { createSlot } from 'react-slotify'
import classNames from 'classnames'
import { Loader } from './Loader'
import ReactPaginate from 'react-paginate'

export const HeaderSlot = createSlot()
export const SortSlot = createSlot()
export const FooterSlot = createSlot()

const PaginationList = (props) => {
	const totalPages = Math.ceil(props.itemsCount / props.itemsInPage)

	// Invoke when user click to request another page.
	const handlePageClick = (payload) => {
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
					<Loader />
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
						renderOnZeroPageCount={null}
					/>
				)}
				<FooterSlot.Renderer childs={props.children} />
			</div>
		</>
	)
}

PaginationList.defaultProps = {
	title: '',
	listStatus: 'idle',
	itemsInPage: 20,
	loadedPage: 1,
	containerClass: '',
	listClass: '',
	itemsCount: 0,
	getPageContent: undefined,
	pageChangedCallback: undefined,
}

PaginationList.propTypes = {
	title: PropTypes.string,
	listStatus: PropTypes.string,
	itemsInPage: PropTypes.number,
	loadedPage: PropTypes.number,
	containerClass: PropTypes.string,
	listClass: PropTypes.string,
	itemsCount: PropTypes.number,
	getPageContent: PropTypes.func,
	pageChangedCallback: PropTypes.func,
}

export default PaginationList
