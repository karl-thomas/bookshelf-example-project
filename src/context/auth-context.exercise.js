import * as React from 'react'
import * as auth from 'auth-provider'
import {client} from 'utils/api-client'
import {FullPageErrorFallback, FullPageSpinner} from 'components/lib'
import {useAsync} from 'utils/hooks'

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function useAuth() {
  const auth = React.useContext(AuthContext)
  if (auth === undefined) {
    throw new Error('useAuth must be used within a AuthProvider component')
  }
  return auth
}

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

function AuthProvider({children}) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    setData(null)
  }

  const value = {user, login, register, logout}
  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  }
}

function useClient() {
  const {
    user: {token},
  } = useAuth()
  return React.useCallback(
    (endpoint, config = {}) => client(endpoint, {...config, token}),
    [token],
  )
}

export {AuthProvider, useAuth, useClient}
