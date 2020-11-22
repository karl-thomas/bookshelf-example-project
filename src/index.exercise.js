import React from 'react'
import ReactDom from 'react-dom'
import {Logo} from './components/logo'

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
