import React from 'react'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Modal, ModalContents, ModalOpenButton} from '../modal'

test('can be opened and closed', () => {
  const label = 'label buddy'
  const title = 'test'
  const content = 'contents'
  const buttonText = 'hey! listen!'
  render(
    <Modal>
      <ModalOpenButton>
        <button>{buttonText}</button>
      </ModalOpenButton>
      <ModalContents aria-label={label} title={title}>
        <p>{content}</p>
      </ModalContents>
    </Modal>,
  )
  userEvent.click(screen.getByRole('button', {name: buttonText}))
  const modal = screen.getByRole('dialog')
  const inModal = within(modal)
  expect(inModal.getByRole('heading', {name: title})).toBeInTheDocument()
  expect(inModal.getByText(content)).toBeInTheDocument()

  userEvent.click(inModal.getByRole('button', {name: /close/i}))

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
