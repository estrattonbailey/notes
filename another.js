// routes/index.js
export function Component (props) {
  return <h1>{props.title}</h1>
}

export function load (context) {
  return {
    title: 'Home'
  }
}

// server.js
import { server } from 'another.js'
import * as home from 'routes/index.js'

const routes = [
  home
]

require('connect')()
  .use((req, res) => {
    const initialContext = {}

    const { load, render } = server(req, res, routes, initialContext)

    load().then(fullContext => {
      render(fullContext) // calls res.end
    })
  })
  .listen(3000)

// client.js
import { client } from 'another.js'
import * as home from 'routes/index.js'

const routes = [
  home
]

const initialClientContext = {}

// self-hydrates from window
client(routes, initialClientContext)
  // middleware, routes wait for these to resolve
  .use(context => {
    return new Promise()
  })
  .before(context => {
    // before each route
  })
  .after(context => {
    // after each route
  })

// API
client.hydrate
client.state
client.router
client.context = { ...state, ...router }
