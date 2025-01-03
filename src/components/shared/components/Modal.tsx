import { useEffect, useRef } from 'react'
import Portal from './Portal'
import './Modal.css'

interface ModalProps {
  title: string
  children: React.ReactNode
  closeModal(): void
  deleteItemFn?(): void
  renderButtons(): JSX.Element
}

export default function Modal({
  title,
  children,
  closeModal,
  renderButtons,
}: ModalProps): JSX.Element {
  // const mounted = useRef(false)
  // useEffect(() => {
  //   mounted.current = true
  //   isMountedCallback && isMountedCallback()
  //   return () => {
  //     mounted.current = false
  //   }
  // }, [])

  return (
    <Portal selector="#modal-portal">
      <div id="modal-container">
        <div id="modal-content">
          <button
            onClick={closeModal}
            id="close-modal-button"
            aria-label="Close modal"
          >
            X
          </button>
          <h3 className="" id="modal-title">
            {title}
          </h3>
          <div id="modal-body">{children}</div>
          <div id="modal-edit-buttons-container">{renderButtons()}</div>
        </div>
      </div>
    </Portal>
  )
}
