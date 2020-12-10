// this module doesn't do anything for the exercise. But you'll use this for
// the extra credit!
import * as React from 'react'
import {AuthProvider} from 'context/auth-context'
import {ReactQueryConfigProvider} from 'react-query'
import {Router} from 'react-router'

const queryConfig = {
  retry(failureCount, error) {
    if (error.status === 404) return false
    else if (failureCount < 2) return true
    else return false
  },
  useErrorBoundary: true,
  refetchAllOnWindowFocus: false,
}

function AppProviders({children}) {
  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    </ReactQueryConfigProvider>
  )
}

export {AppProviders}
