import React from 'react';
// Імпортуємо залежність, яка і будує графіки
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

  /*
   * При оновленні підкомпоненти оновлюється вся компонента,
   * яка містить ту саму підкомпоненту (викликається render()).
   */
  componentDidUpdate(prevProps) {
    //Якщо це не один і той самий об'єкт з властивостями
    if (this.props !== prevProps) {
      // Установлюємо новий стан
      this.setState({
        func: this.props.func,
        min: this.props.min,
        max: this.props.max,
        delimeter: this.props.delimeter
      });
    }
    // Така перевірка дає уникнути безкінечний цикл
  }

  render() {
    // Витагуємо все, що нам треба
    const { func, min, max, delimeter } = this.state;
    /*
     * А ось тут про взаємозамінність.
     * Якщо кінець проміжку більший, ніж початок, міняємо місцями,
     * але при цьому усе присвоюється до нових змінних mn, mx.
     * Але чому квадратні дужки, а не фігурні, як це було вище?
     * Тому що фігурні дужки - це об'єкт, і там чітка прив'язка
     * до імен (ключів).
     * Квадратні - це масив, і там нема прив'язки до імен змінних,
     * а лише до позицій.
     */
    const [ mn, mx ] = (min < max) ?
      [ min, max ] :
      [ max, min ];
    // Кількість елементів в масиві
    const num = Math.ceil((mx - mn + 1) / delimeter);
    // Функція, яка нормалізує значення (значення ітерації в абсолютне)
    const norm = value => value * delimeter + mn;
    /*
     * Масив індексів осей x, y
     * Спочатку створюється порожній масив з фіксованоб довжиною
     * num, потім наповнюється нулями, а потім кожне значення ітеративно
     * замінюється на відповідне значення осі.
     */
    const axe = Array(num)
      .fill(0)
      .map((_, i) => norm(i));
    /*
     * Матриця значень
     * Спочатку створюємо масив, наповнюємо нулями, а потім
     * створюємо підмасиви тієї ж довжини, що і головний масив,
     * наповнюємо нулями, а потім ітеративно наповнюємо результатами
     * функції залежно від нормалізованих значень x та y.
     */
    const values = Array(num)
      .fill(0)
      .map((row, y) => Array(num)
        .fill(0)
        .map((_, x) => func(norm(x), norm(y))));
    /*
     * Об'єкт з властивостями графіка, який потім буде передано
     * в компонент Plot.
     */
    const trace = [{
      x: axe,
      y: axe,
      z: values,
      type: 'surface'
    }];
    // Повертаємо графік
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
