// 🐨 here are the things you're going to need for this test:
import * as React from 'react'
import {
  render,
  screen,
  waitForLoadingToFinish,
  userEvent,
  createAuthUser,
} from 'test/app-test-utils'
import {buildBook, buildListItem} from 'test/generate'
import {App} from 'app'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import {formatDate} from 'utils/misc'

async function renderBookScreen({user, book, listItem} = {}) {
  user = user === undefined ? await createAuthUser() : user

  book = book === undefined ? await booksDB.create(buildBook()) : book

  listItem =
    listItem === undefined
      ? await listItemsDB.create(buildListItem({owner: user, book}))
      : listItem

  const route = `/book/${book.id}`
  const utils = await render(<App />, {user, route})

  return {
    ...utils,
    book,
    user,
    listItem,
  }
}

test('renders all the book information', async () => {
  const {book} = await renderBookScreen({listItem: null})

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

test('can create a list item for the book', async () => {
  await renderBookScreen({listItem: null})

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

test('can remove a list item for the book', async () => {
  await renderBookScreen()

  userEvent.click(
    screen.getByRole('button', {
      name: /remove from list/i,
    }),
  )

  expect(
    screen.queryByRole('button', {name: /add to list/i}),
  ).toBeInTheDocument()
})

test('can mark a list item as read', async () => {
  jest.useFakeTimers()
  const {listItem} = await renderBookScreen()

  userEvent.click(
    screen.getByRole('button', {
      name: /mark as read/i,
    }),
  )
  await waitForLoadingToFinish()

  expect(
    screen.findByRole('button', {name: /mark as unread/i}),
  ).toBeInTheDocument()
  expect(screen.getByLabelText(/start and finish date/i)).toHaveTextContent(
    `${formatDate(listItem.startDate)} — ${formatDate(Date.now())}`,
  )
})

test('can edit a note', async () => {
  jest.useFakeTimers()
  const {listItem} = await renderBookScreen()

  const notes = 'VYre SPECIaL NOTeS'
  const notesTextarea = screen.getByRole('textbox', {name: /notes/i})

  userEvent.clear(notesTextarea)
  userEvent.type(notesTextarea, notes)
  await screen.findByLabelText(/loading/i)
  await waitForLoadingToFinish()

  expect(notesTextarea).toHaveValue(notes)

  expect(await listItemsDB.read(listItem.id)).toMatchObject({
    notes,
  })
})
