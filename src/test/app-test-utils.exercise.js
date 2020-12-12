import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import {buildUser} from 'test/generate'
import {AppProviders} from 'context'
import * as usersDB from 'test/data/users'
import * as auth from 'auth-provider'
import userEvent from '@testing-library/user-event'

async function createAuthUser() {
  const user = buildUser()
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(auth.localStorageKey, authUser.token)
  return authUser
}

async function render(ui, {route = '/list', user, ...options}) {
  user = typeof user === 'undefined' ? await createAuthUser() : user
  window.history.pushState({}, 'Test page', route)
  const result = rtlRender(ui, {wrapper: AppProviders, ...options})
  await waitForLoadingToFinish()
  return {...result, user}
}

async function waitForLoadingToFinish() {
  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ])
}

export * from '@testing-library/react'
export {render, userEvent, createAuthUser, waitForLoadingToFinish}
