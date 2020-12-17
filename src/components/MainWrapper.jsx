import React from 'react';
import FuncPlot from './FuncPlot.jsx';
import InputField from './InputField.jsx';
import './MainWrapper.css';

// eslint-disable-next-line
const { sin, cos, sqrt } = Math;

const fieldValues = {
  func: 'x ** 2 + y ** 2',
  min: 0,
  max: 20,
  delimeter: 1
};

const strToFn = str => eval('(x, y) => ' + str);

export default class MainWrapper extends React.Component {
  #lock = 0;
  constructor(props) {
    super(props);

    this.state = fieldValues;
    this.setNewValue = this.setNewValue.bind(this);
    this.handleFunc = this.handleFunc.bind(this);
    this.handleMin = this.handleMin.bind(this);
    this.handleMax = this.handleMax.bind(this);
    this.handleDelimeter = this.handleDelimeter.bind(this);
  }

  setNewValue(key, value) {
    fieldValues[key] = value;
    ++this.#lock;

    setTimeout(() => {
      --this.#lock;
      if (this.#lock === 0) {
        try {

          const newValue = fieldValues[key];

          if (key === 'func') {
            if (newValue.includes(';'))
              throw new Error('semicolon is rejected');

            const predicate = strToFn(newValue);
            if (typeof predicate(0, 0) !== 'number')
              throw new Error('should return a number');

          } else {
            fieldValues[key] = parseFloat(newValue);
          }

          this.setState(() => fieldValues);
        } catch (e) {
          alert(key + ': ' + e.message);
        }
      }
    }, 3000);
  }

  handleFunc(event) {
    this.setNewValue('func', event.target.value);
  }

  handleMin(event) {
    this.setNewValue('min', event.target.value);
  }

  handleMax(event) {
    this.setNewValue('max', event.target.value);
  }

  handleDelimeter(event) {
    this.setNewValue('delimeter', event.target.value);
  }

  render() {
    const predicate = strToFn(this.state.func);
    return (
      <div>
        <div className="inputForm">
          <InputField label="Функція"
            initValue={ this.state.func }
            onChange={ this.handleFunc } />
          <InputField label="Мінімальне значення"
            initValue={ this.state.min }
            onChange={ this.handleMin } />
          <InputField label="Максмальне значення"
            initValue={ this.state.max }
            onChange={ this.handleMax } />
          <InputField label="Ділення"
            initValue={ this.state.delimeter }
            onChange={ this.handleDelimeter } />
        </div>
        <FuncPlot func={ predicate } min={ this.state.min }
          max={this.state.max } delimeter={ this.state.delimeter } />
      </div>
    );
  }
}
