import * as React from 'react'
import {Dialog} from './lib'

const ModalContext = React.createContext()
ModalContext.displayName = 'ModalContext'

function Modal(props) {
  const [isOpen, setIsOpen] = React.useState(false)

  return <ModalContext.Provider value={{isOpen, setIsOpen}} {...props} />
}

function useModal() {
  const context = React.useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a Modal')
  }
  return context
}

function ModalDismissButton({children}) {
  const {setIsOpen} = useModal()
  return React.cloneElement(children, {onClick: () => setIsOpen(false)})
}

function ModalOpenButton({children}) {
  const {setIsOpen} = useModal()
  return React.cloneElement(children, {onClick: () => setIsOpen(true)})
}

function ModalContents(props) {
  const {isOpen, setIsOpen} = useModal()
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

export {Modal, ModalDismissButton, ModalContents, ModalOpenButton}
