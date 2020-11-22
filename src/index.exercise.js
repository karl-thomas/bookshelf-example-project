import React from 'react'
import ReactDom from 'react-dom'
import {Logo} from './components/logo'
import {Dialog} from '@reach/dialog'
import '@reach/dialog/styles.css'

const LoginDialog = ({onDismiss = () => {}, ...props}) => (
  <Dialog aria-label="login form" onDismiss={onDismiss} {...props}>
    <h2>Welcome Back</h2>
    <button onClick={onDismiss}>close</button>
    <LoginForm buttonText="login" onSubmit={console.log} />
  </Dialog>
)

const RegisterDialog = ({onDismiss = () => {}, ...props}) => (
  <Dialog aria-label="register form" onDismiss={onDismiss} {...props}>
    <h2>Howdy Pardner</h2>
    <button onClick={onDismiss}>close</button>
    <LoginForm buttonText="register" onSubmit={console.log} />
  </Dialog>
)

const LoginForm = ({buttonText, onSubmit}) => {
  const handleSubmit = event => {
    event.preventDefault()
    const {username, password} = event.target.elements
    onSubmit({username: username.value, password: password.value})
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username: </label>
      <input type="text" id="username" />
      <label htmlFor="password">Password: </label>
      <input type="password" id="password" />
      <button type="submit">{buttonText}</button>
    </form>
  )
}

const App = () => {
  const [showModal, setShowModal] = React.useState('none')
  const close = () => setShowModal('none')
  return (
    <>
      <Logo />
      <h1>Bookshelf</h1>
      <button onClick={() => setShowModal('login')}>Login</button>
      <button onClick={() => setShowModal('register')}>Register</button>
      <LoginDialog onDismiss={close} isOpen={showModal === 'login'} />
      <RegisterDialog onDismiss={close} isOpen={showModal === 'register'} />
    </>
  )
}

ReactDom.render(<App />, document.getElementById('root'))
