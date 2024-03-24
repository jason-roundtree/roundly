import { useState } from 'react'
import Portal from './Portal'
import './Modal.css'

interface ModalContainerProps {
  title: string
  children: React.ReactNode
  closeModal: () => void
  deleteItemFn?: () => void
}

export default function ModalContainer({
  title,
  children,
  closeModal,
}: ModalContainerProps): JSX.Element {
  return (
    <Portal selector="#portal">
      <div id="modal-container">
        <div id="modal">
          <h2 className="text-xl font-bold mt-4" id="modal-title">
            {title}
          </h2>
          <div id="modal-body">{children}</div>
          <div id="modal-footer">
            <button onClick={closeModal} id="close-modal-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Portal>
  )
}
