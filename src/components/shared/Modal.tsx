import { useState } from 'react'
import Portal from './Portal'
import './Modal.css'

export default function Modal({ title, children }) {
  return (
    <Portal selector="#portal">
      <div id="modal-container">
        <h2 className="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
      </div>
    </Portal>
  )
}
