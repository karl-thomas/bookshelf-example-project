/** @jsx jsx */
import {jsx} from '@emotion/core'

import VisuallyHidden from '@reach/visually-hidden'
import * as React from 'react'
import {CircleButton, Dialog} from './lib'

const ModalContext = React.createContext()
ModalContext.displayName = 'ModalContext'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

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
  return React.cloneElement(children, {
    onClick: callAll(() => setIsOpen(false), children.props.onClick),
  })
}

function ModalOpenButton({children}) {
  const {setIsOpen} = useModal()
  return React.cloneElement(children, {
    onClick: callAll(() => setIsOpen(true), children.props.onClick),
  })
}

function ModalContentsBase(props) {
  const {isOpen, setIsOpen} = useModal()
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}
const circleDismissButton = (
  <div css={{display: 'flex', justifyContent: 'flex-end'}}>
    <ModalDismissButton>
      <CircleButton>
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden>×</span>
      </CircleButton>
    </ModalDismissButton>
  </div>
)

function ModalContents(props) {
  return (
    <ModalContentsBase {...props}>
      {circleDismissButton}
      {props.title ? (
        <h3 css={{textAlign: 'center', fontSize: '2em'}}>{props.title}</h3>
      ) : (
        ''
      )}
      {props.children}
    </ModalContentsBase>
  )
}

export {
  Modal,
  ModalDismissButton,
  ModalContentsBase,
  ModalContents,
  ModalOpenButton,
}
