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
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        func: this.props.func,
        min: this.props.min,
        max: this.props.max,
        delimeter: this.props.delimeter
      });
    }
  }

  render() {
    const { min, max, delimeter } = this.state;
    const [ mn, mx ] = (min < max) ?
      [ min, max ] :
      [ max, min ];
    console.log(mn);
    console.log(mx);
    const num = Math.ceil((mx - mn + 1) / delimeter);
    const norm = value => value * delimeter + mn;
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
    );
  }
}
