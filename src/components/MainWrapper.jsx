// Імпортуємо Реакт
import React from 'react';
// Імпортуємо наші компоненти, а саме:
// * елемент з графіком
import FuncPlot from './FuncPlot.jsx';
// * елемент поля введення інформації
import InputField from './InputField.jsx';
// Імпортуємо стилі
import './MainWrapper.css';

/*
 * Декомпозиція дозволяє витягнути із об'єкта
 * властивості та оголосити їх як змінні.
 * Наприклад:
 *
 * const obj = { name: 'Foo', age: 42 };
 * const { name, age } = obj;
 * console.log(name); // Foo
 * console.log(age);  // 42
 *
 * Тим же чином витягнемо математичні функції
 * із вбудованого об'єкта Math, щоб у рядку
 * писати sin(x), cos(y) замість
 * Math.sin(x), Math.cos(y).
 *
 * Можна помітити цікавий коментар
 * // eslint-disable-next-line
 * Взагалі, на саму роботу коду він не впливає,
 * але я прописав доволі строгу конфігурацію
 * лінтера (перевірка на стиль коду).
 * Лінтер зафіксував, що я оголосив ці змінні,
 * але в коді їх ніде не застосував (лінтер
 * не знає, що вони будуть застосовані згодом),
 * і тому не дає зкомпілювати код.
 * Цей коментар повідомляє, що стрічку коду
 * після цього коментаря лінтер не повинен
 * перевіряти.
 */

// eslint-disable-next-line
const { sin, cos, tan, sqrt, abs, exp } = Math;

/*
 * Оголосимо об'єкт fieldValues, який зберігатиме такі властивості:
 * func - функція, для якої будуватиметься графік
 * min - початкова точка відліку X та Y
 * max - кінцева точка відліку X та Y
 * delimeter - дільник, тобто, покажчик кроку, з яким
 * будуватиметься графік
 *
 * min та max взаємнозамінні (про це в FuncPlot.jsx)
 */
const fieldValues = {
  func: 'x ** 2 + y ** 2',
  min: 0,
  max: 20,
  delimeter: 1
};

/*
 * strToFn(str)
 * str - стрічка (Стрінг), яка містить функцію.
 * Повертає функцію, якою можна користуватись для обчислень
 * в контексті JS.
 *
 * eval перетворює стрічку на функцію.
 * Забув сказати, що для новітнього JS функція може бути
 * записана як:
 * (аргументи) => { тіло функції }
 * (аргументи) => значення, яке повернеться із функції
 * аргумент => значення, яке повернеться із функції
 *
 * Таким чином, функція присвоєна у змінну strToFn.
 */
const strToFn = str => eval('(x, y) => ' + str);

const TIMEOUT = 4000;

/*
 * export - вмонтований об'єкт, який містить усі змінні,
 * які будуть експортовані в інший файл.
 * export default - лише цей клас буде експортовано.
 * class MainWrapper - клас ГоловнаОбгортка (містить
 * все те, що буде зображено на сайті).
 * extends React.Component - походить від класу Компонент
 * бібліотеки Реакт.
 * Таким чином, це - класовий компонент Реакту.
 */
export default class MainWrapper extends React.Component {
  /* Приватна змінна lock фіксує момент, коли треба
   * перебудувати графік.
   * Про це більше згодом.
   */
  #lock = 0;
  /*
   * Конструктор компоненту Реакт.
   * Приймає властивості (props), які були згадані
   * у файлі App.js
   */
  constructor(props) {
    /*
     * Викликаємо батьківський конструктор, передаємо властивості.
     * Нагадаю, що їх для цього компонента нема, але все одно
     * так варто робити.
     */
    super(props);

    /*
     * До стану компоненту присвоюємо об'єкт, який містить
     * всі необхідні властивості.
     */
    this.state = fieldValues;
    /*
     * Прив'яжемо усі методи класу до контексту this.
     * Дещо тупо, але це JS.
     */
    this.setNewValue = this.setNewValue.bind(this);
    this.handleFunc = this.handleFunc.bind(this);
    this.handleMin = this.handleMin.bind(this);
    this.handleMax = this.handleMax.bind(this);
    this.handleDelimeter = this.handleDelimeter.bind(this);
  }

  /*
   * Метод setNewValue відповідає за зміну стану
   * залежно від переданих значень.
   * key - назва ключа
   * value - значення, яке передається
   */
  setNewValue(key, value) {
    /*
     * Присвоїмо у об'єкт до відповідного ключа відповідне значення.
     * Прошу помітити, що стан ще не змінився.
     */
    fieldValues[key] = value;
    /*
     * А тепер щодо lock.
     * Ця змінна визначає, коли саме можна буде змінювати стан.
     * При кожній зміні значення у полі вводу ця величина збільшується.
     * Це дає змогу змінювати стан лише тоді, коли користувач нічого
     * не вводить протягом TIMEOUT мілісекунд.
     */
    ++this.#lock;
    // setTimeout(функція, перерва у мс)
    setTimeout(() => {
      // Зменшуємо lock
      --this.#lock;
      // Якщо lock дорівнює нулю (рівно 4 секунди користувач нічого не вводив)
      if (this.#lock === 0) {
        // Цей шмат коду може викинути помилку, відловлюємо
        try {
          // Цикл проходиться по ключах об'єкту fieldValues
          for (const key in fieldValues) {
            // newValue (новеЗначення), тому що воно нове відносно стану
            const newValue = fieldValues[key];
            // Якщо ключ -- func (функція)
            if (key === 'func') {
              // Якщо у функції присутні крапки з комою
              // (потенційно небезпечний код)
              if (newValue.includes(';'))
                // викидаємо помилку "крапка з комою заборонена"
                throw new Error('semicolon is rejected');
              // Тепер утворимо функцію зі стрічки
              const mathFunc = strToFn(newValue);
              // Якщо функція не повертає число
              if (typeof mathFunc(0, 0) !== 'number')
                // Робимо користувачу "а-тя-тя"
                throw new Error('should return a number');
            // Якщо ключ -- один із min, max, delimeter
            } else {
              // Перетворимо стрічку на числовий тип (допускаємо плаваючу кому)
              const parsed = parseFloat(newValue);
              // Якщо отримане значення -- не число
              if (isNaN(parsed))
                // "має бути числом"
                throw new Error('should be a number');
              // В іншому разі, спокійно присвоюємо
              fieldValues[key] = parsed;
            }
          }
          // Змінимо стан на новий
          this.setState(() => fieldValues);
        } catch (e) {
          // Якщо помилка таки сталась, то показуємо повідомлення
          alert(key + ': ' + e.message);
        }
      }
    }, TIMEOUT);
  }

  // Функція, яка отримує нове значення від поля "Функція"
  handleFunc(event) {
    // Передаємо отримане значення з відповідним ключем
    this.setNewValue('func', event.target.value);
  }

  // Від поля "Початок проміжку"
  handleMin(event) {
    this.setNewValue('min', event.target.value);
  }

  // Від поля "Кінець проміжку"
  handleMax(event) {
    this.setNewValue('max', event.target.value);
  }

  // Від поля "Ділення"
  handleDelimeter(event) {
    this.setNewValue('delimeter', event.target.value);
  }

  render() {
    // Перетворимо стрічку з функцією в дійсну функцію
    const mathFunc = strToFn(this.state.func);
    // Повертаємо оцю купу компонентів (якщо їх багато, обгортаємо в <div>)
    return (
      <div>
        <div className="inputForm">
          <InputField label="Функція"
            initValue={ this.state.func }
            onChange={ this.handleFunc } />
          <InputField label="Початок проміжку"
            initValue={ this.state.min }
            onChange={ this.handleMin } />
          <InputField label="Кінець проміжку"
            initValue={ this.state.max }
            onChange={ this.handleMax } />
          <InputField label="Ділення"
            initValue={ this.state.delimeter }
            onChange={ this.handleDelimeter } />
        </div>
        <FuncPlot func={ mathFunc } min={ this.state.min }
          max={this.state.max } delimeter={ this.state.delimeter } />
      </div>
    );
  }
}
