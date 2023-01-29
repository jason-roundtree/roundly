import { useState } from 'react'
import Portal from './Portal'
import './Modal.css'

export default function Modal({ title, children, closeModal }) {
  return (
    <Portal selector="#portal">
      <div id="modal-container">
        <span onClick={closeModal} id="closeModalBtn">
          X
        </span>
        <div id="modal">
          <h2 className="text-xl font-bold mt-4" id="modal-title">
            {title}
          </h2>
          <div id="modal-body">{children}</div>
        </div>
      </div>
    </Portal>
  )
}
