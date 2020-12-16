import React from 'react';
import Plot from 'react-plotly.js';

export default class FuncPlot extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
       func: props.func,
       min: props.min,
       max: props.max,
       delimeter: props.delimeter
    }
  }

  render() {
    const mn = this.state.min;
    const dl = this.state.delimeter;
    const num = Math.ceil((this.state.max - mn + 1) / dl);
    const norm = value => value * dl + mn;
    const axe = Array(num)
      .fill(0)
      .map((_, i) => norm(i));
    const values = Array(num)
      .fill(0)
      .map((row, y) => Array(num)
        .fill(0)
        .map((_, x) => this.state.func(norm(x), norm(y))));
    const trace = [{
      x: axe,
      y: axe,
      z: values,
      type: 'surface'
    }];
    return (
      <Plot
        data={ trace }
        layout={{
          width: 900,
          height: 800,
          title: 'Графік 3D функції'
        }}
      />
    )
  }
}