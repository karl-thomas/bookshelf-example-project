import React from 'react'
import ReactDom from 'react-dom'
import {Logo} from './components/logo'
// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

const App = () => {
  const handleButtonClick = () => alert('button was clicked')
  return (
    <>
      <Logo />
      <h1>Bookshelf</h1>
      <button onClick={handleButtonClick}>Login</button>
      <button onClick={handleButtonClick}>Register</button>
    </>
  )
}

ReactDom.render(<App />, document.getElementById('root'))
// 🐨 use ReactDOM to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
