// external library imports
import Component from 'inferno-component';
import createElement from 'inferno-create-element';

// this data structure gets passed into this component as 'props'
export interface IHelloProps {
  name?: string
}

// internal 'state' data structure of this component
export interface IHelloState {
  name: string
}

// the (stateful) component for the page with type checking
export default class HelloPage extends Component<IHelloProps, IHelloState> {
  constructor(props) {
    super(props);
    this.state = {
      name: 'world'
    }
  }
  render() {
    return (
      <div>
        <h1>Hello, { this.state.name }</h1>
      </div>
    )
  }
}