import { ToastContainer } from 'react-toastify'

import Portal from './Portal'

interface ToastPortalOptions {
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  autoClose?: number
}

// TODO: how to set this up so that options can be passed in? Context in App.tsx??
export default function ToastPortal({
  position = 'bottom-right',
  autoClose = 3000,
}: ToastPortalOptions) {
  return (
    <Portal selector="#app-toast-portal">
      <ToastContainer position={position} autoClose={autoClose} />
    </Portal>
  )
}
