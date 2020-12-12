// 🐨 here are the things you're going to need for this test:
import * as React from 'react'
import {
  render as rtlRender,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import {App} from 'app'
import {server} from 'test/server/test-server'
import * as usersDB from 'test/data/users'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import userEvent from '@testing-library/user-event'

afterEach(async () => {
  queryCache.clear()
  await Promise.all([
    auth.logout(),
    usersDB.reset(),
    booksDB.reset(),
    listItemsDB.reset(),
  ])
})

async function createAuthUser() {
  const user = buildUser()
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(auth.localStorageKey, authUser.token)
  return authUser
}

function render(ui, options = {}) {
  return rtlRender(ui, {wrapper: AppProviders, ...options})
}

async function waitForLoadingToFinish() {
  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ])
}

test('renders all the book information', async () => {
  await createAuthUser()
  const book = await booksDB.create(buildBook())

  window.history.pushState({}, book.title, `/book/${book.id}`)

  render(<App />)

  await waitForLoadingToFinish()

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

test('renders all the book information', async () => {
  await createAuthUser()
  const book = await booksDB.create(buildBook())

  window.history.pushState({}, book.title, `/book/${book.id}`)

  render(<App />)
  await waitForLoadingToFinish()

  userEvent.click(screen.getByRole('button', {name: /add to list/i}))
  await waitForLoadingToFinish()

  expect(
    screen.queryByRole('button', {name: /add to list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.getByRole('button', {name: /mark as read/i}),
  ).toBeInTheDocument()
  expect(screen.getByLabelText(/notes/gi)).toBeInTheDocument()
})