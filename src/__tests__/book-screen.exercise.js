// 🐨 here are the things you're going to need for this test:
import * as React from 'react'
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import {App} from 'app'

afterEach(() => {
  queryCache.clear()
  auth.logout()
})

function authorize(token) {
  window.localStorage.setItem(auth.localStorageKey, token)
}

test('renders all the book information', async () => {
  const token = 'token buddy'
  authorize(token)
  const user = buildUser({token})
  const book = buildBook()

  window.history.pushState({}, book.title, `/book/${book.id}`)
  const originalFetch = window.fetch
  window.fetch = async (url, config) => {
    if (url.endsWith('/bootstrap')) {
      return {
        ok: true,
        json: async () => ({
          user: {...user, token: 'SOME_FAKE_TOKEN'},
          listItems: [],
        }),
      }
    } else if (url.endsWith(`/books/${book.id}`)) {
      return {ok: true, json: async () => ({book})}
    }
    return originalFetch(url, config)
  }
  render(<App />, {wrapper: AppProviders})
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  screen.debug()
  expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute(
    'src',
    book.coverImageUrl,
  )
  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()
})
