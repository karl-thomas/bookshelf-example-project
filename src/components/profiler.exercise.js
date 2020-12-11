import * as React from 'react'
import {client} from 'utils/api-client'

function Profiler({id, metadata, children}) {
  function handleRender(
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions, // the Set of interactions belonging to this update
  ) {
    client('profile', {
      data: {
        id,
        metadata,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions: [...interactions],
      },
    })
  }
  return <React.Profiler id={id} onRender={handleRender} children={children} />
}

export {Profiler}
export {unstable_trace as trace, unstable_wrap as wrap} from 'scheduler/tracing'
