import * as React from 'react'

// the (stateful) component for the page with type checking
export default class HelloPage extends React.Component<{}, {}> {

  render() {
    return (
      <div>
        <h1>Hello World!</h1>
      </div>
    )
  }
}