import classNames from 'classnames'
import React, { useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import { createSlot } from 'react-slotify'
import { TPopupContentType } from 'types'

export const PopupHeaderSlot = createSlot()
export const PopupFooterSlot = createSlot()

interface PopuperProps {
	opened: boolean
	width?: string
	height?: string
	contentType?: TPopupContentType
	closeHandler: () => void
	unmountHandler: () => void
	children: React.ReactNode
}

export const Popuper = ({
	opened,
	width = '500px',
	height = 'auto',
	contentType = 'usual',
	closeHandler,
	unmountHandler,
	children,
}: PopuperProps) => {
	const handleWrapperClick = (event: React.MouseEvent) => {
		if (
			event.target instanceof Element &&
			event.target.classList.contains('modal-wrapper')
		) {
			document.querySelector('body')?.classList.remove('noscroll')
			closeHandler()
		}
	}

	const escPressed = (event: KeyboardEvent) => {
		console.log('event', event)
		if (event.keyCode === 27) {
			document.querySelector('body')?.classList.remove('noscroll')
			closeHandler()
		}
	}

	useEffect(() => {
		document.addEventListener('keyup', escPressed)
		document.querySelector('body')?.classList.add('noscroll')

		return () => {
			document.querySelector('body')?.classList.remove('noscroll')
			document.removeEventListener('keyup', escPressed)
		}
		// eslint-disable-next-line
	}, [])

	return (
		<CSSTransition
			classNames={'modal'}
			in={opened}
			timeout={300}
			unmountOnExit={true}
			onExited={unmountHandler}
		>
			<div className="modal modal-mask">
				<div className="modal-wrapper" onClick={handleWrapperClick}>
					<div
						className={classNames(
							'modal-container',
							{
								'full-width':
									contentType === 'video' || contentType === 'image',
							},
							{ 'video-content': contentType === 'video' },
							{ 'picture-content': contentType === 'image' }
						)}
						style={{ width, height }}
					>
						<div className="modal-inner">
							<svg
								className={classNames('close', {
									outside: contentType === 'video' || contentType === 'image',
								})}
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								onClick={closeHandler}
							>
								<path d="M20 20L4 4m16 0L4 20"></path>
							</svg>
							<div className="modal-header">
								<PopupHeaderSlot.Renderer childs={children} />
							</div>
							<div className="modal-body">{children}</div>
							<div className="modal-footer">
								<PopupFooterSlot.Renderer childs={children} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</CSSTransition>
	)
}
