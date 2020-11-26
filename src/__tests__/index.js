<<<<<<< HEAD
import ReactDOM from 'react-dom'
import {screen} from '@testing-library/react'
=======
import chalk from 'chalk'
import ReactDOM from 'react-dom'
import {screen, prettyDOM} from '@testing-library/react'

function withMessage(cb, message, {solo = true} = {}) {
  try {
    cb()
  } catch (error) {
    if (solo) {
      // eslint-disable-next-line no-throw-literal
      throw `🚨  ${chalk.reset.red(message)}`
    } else {
      error.message = `🚨  ${chalk.reset.red(message)}\n\n${error.message}`
    }
    throw error
  }
}
>>>>>>> exercises/02-styles

test('renders the app', () => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.append(root)

  require('..')

  screen.getByTitle('Bookshelf')
  screen.getByRole('heading', {name: /Bookshelf/i})
  screen.getByRole('button', {name: /Login/i})
  screen.getByRole('button', {name: /Register/i})

<<<<<<< HEAD
=======
  const cssEl = document.body.querySelector('[css]')
  withMessage(
    () => expect(cssEl).toBeNull(),
    `
At least one element has an attribute called "css". This means that emotion did not compile the prop correctly.

Make sure to include this at the top of the file:

/** @jsx jsx */
import {jsx} from '@emotion/core'


Here's the element that has the css attribute that wasn't compiled:

${prettyDOM(cssEl)}
    `.trim(),
  )

  withMessage(
    () => expect(document.body.querySelector('[class*=css-]')).not.toBeNull(),
    `None of the elements are styled by emotion. Make sure to render a styled component and use the css prop.`,
  )

>>>>>>> exercises/02-styles
  // cleanup
  ReactDOM.unmountComponentAtNode(root)
  document.body.removeChild(root)
})
