import React from 'react';
import './InputField.css';

export default class InputField extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
       value: props.initValue
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    return (
      <label>
        { this.props.label }
        <input type="text" value={ this.state.value }
          onChange={ this.handleChange } />
      </label>
    );
  }
}