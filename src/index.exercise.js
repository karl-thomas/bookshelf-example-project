import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {App} from './app'
import {AppProviders} from './context'
import {Profiler} from 'components/profiler'

loadDevTools(() => {
  ReactDOM.render(
    <Profiler id="Root of App">
      <AppProviders>
        <App />
      </AppProviders>
    </Profiler>,
    document.getElementById('root'),
  )
})
