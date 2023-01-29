import { useState } from 'react'
import Portal from './Portal'
import './Modal.css'

interface ModalProps {
  title: string
  children: React.ReactNode
  closeModal: () => void
  deleteItemFn?: () => {}
}

export default function Modal({
  title,
  children,
  closeModal,
  deleteItemFn,
}: ModalProps): JSX.Element {
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
            {deleteItemFn && (
              <button onClick={deleteItemFn} id="delete-item-btn">
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </Portal>
  )
}
