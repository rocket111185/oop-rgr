import React from 'react';
//import FuncPlot from './FuncPlot.jsx';
import InputField from './InputField.jsx';

let
  func = 'x ** 2 + y ** 2',
  min = 0,
  max = 20,
  delimeter = 1;

export default class MainWrapper extends React.Component {
  render() {
    return (
      <div>
        <InputField label="Функція" initValue={ func } />
        <InputField label="Мінімальне значення" initValue={ min } />
        <InputField label="Максмальне значення" initValue={ max } />
        <InputField label="Ділення" initValue={ delimeter } />
      </div>
    )
  }
}