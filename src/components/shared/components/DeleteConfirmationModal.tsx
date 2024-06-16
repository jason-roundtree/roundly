import React from 'react'

import Modal from './Modal'

interface DeleteConfirmationModalProps {
  modalTitle: string
  confirmationText: string
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
  return (
    <Modal
      title={modalTitle}
      closeModal={toggleModalActive}
      renderButtons={() => <ConfirmDeletionButton />}
    >
      <p>{confirmationText}</p>
      {/* <button onClick={onConfirmDelete}>{buttonText}</button> */}
    </Modal>
  )
}
