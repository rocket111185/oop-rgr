import React from 'react';
import './InputField.css';

// Компонент "ПолеВводу"
export default class InputField extends React.Component {
  constructor(props) {
    super(props);
    // В цьому разі, до стану присвоєно анонімний об'єкт
    this.state = {
      value: props.initValue
    };
    this.handleChange = this.handleChange.bind(this);
  }

  // Ця функція оновлює стан компоненту
  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    /*
     * На жаль, всередині JSX виразів не можна вставляти коментарі,
     * тому я поясню деякі деталі тут.
     * className - це властивість, яка в HTML уже носить назву class.
     * Вона дає змогу надати клас компоненті для того, щоб можна було
     * застосувати стилі до усього класу.
     *
     * onChange - функція, яка викликатиметься кожного разу, коли змінюється
     * стан компоненти.
     * Оскільки input - це лише підкомпонента InputField, то нам треба
     * вручну прописати код, який оновлюватиме стан InputField при оновленні
     * стану input.
     */
    return (
      <div className="inputField" onChange={ this.props.onChange }>
        <label>
          { this.props.label }
          <input type="text" value={ this.state.value }
            onChange={ this.handleChange } />
        </label>
      </div>
    );
  }
}
