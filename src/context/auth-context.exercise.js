import {createContext, useContext} from 'react'
const AuthContext = createContext()
AuthContext.displayName = 'AuthContext'

function useAuth() {
  const auth = useContext(AuthContext)
  if (auth === undefined) {
    throw new Error(
      'useAuth must be used within a AuthContext.Provider component',
    )
  }
  return auth
}

export {AuthContext, useAuth}
