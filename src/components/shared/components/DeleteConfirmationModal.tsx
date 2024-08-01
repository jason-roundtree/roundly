import React from 'react'

import Modal from './Modal'

interface DeleteConfirmationModalProps {
  modalTitle?: string
  confirmationText: string | JSX.Element
  buttonText: string
  toggleModalActive(): void
  onConfirmDelete(): void
}

export default function DeleteConfirmationModal({
  modalTitle,
  confirmationText,
  buttonText,
  toggleModalActive,
  onConfirmDelete,
}: DeleteConfirmationModalProps) {
  function ConfirmDeletionButton(): JSX.Element {
    return <button onClick={onConfirmDelete}>{buttonText}</button>
  }

  const confirmationElement =
    typeof confirmationText === 'string' ? (
      <p>{confirmationText}</p>
    ) : (
      confirmationText
    )
  return (
    <Modal
      title={modalTitle ? modalTitle : ''}
      closeModal={toggleModalActive}
      renderButtons={() => <ConfirmDeletionButton />}
    >
      {confirmationElement}
      {/* <button onClick={onConfirmDelete}>{buttonText}</button> */}
    </Modal>
  )
}
