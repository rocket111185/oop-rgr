// Імпортуємо Реакт
import React from 'react';
/*
 * Імпортуємо компонент ГоловнаОбгортка
 * Більше - дивіться файл MainWrapper.jsx
 */
import MainWrapper from './components/MainWrapper.jsx';

/*
 * Створюємо функціональний компонент Додаток (App),
 * який є вхідною точкою будь-якого додатку Реакт
 * (щось на кшталт int main).
 */

function App() {
  /*
   * В Реакті усе - компонент.
   * Але що таке компонент?
   * Це абстрактна складова сайту.
   * Таким чином, App - це головний компонент.
   * Компоненти поділяються на 2 типи: функціональний та класовий.
   * App має бути обов'язково функціональним, це умова Реакту.
   * Функціональні компоненти повертають компонент одразу ж,
   * і вони не мають стану, на відміну від класових.
   * Стан - це властивості компоненту, які залежно від ситуації
   * можуть змінюватись на ходу (ось це і є фішкою Реакту).
   *
   * Будь-який компонент у Реакті може оголошуватись двома способами:
   * React.createElement(НазваКомпоненту, [властивості], [...нащадки]);
   * або
   * <НазваКомпоненту властивість1={ значення1 } властивість2={ значення2 } >
   *  ...нащадки
   * <НазваКомпоненту />
   * Другий варіант називається JSX (JS eXtension, розширення JavaScript).
   *
   * Якщо нащадків нема, то можна зробити і так:
   * <НазваКомпоненту властивість1={ значення1 } властивість2="значення2"... />
   * В даному випадку створюється компонент MainWrapper
   * без нащадків та властивостей.
   */
  return <MainWrapper />;
}

/*
 * Цей компонент експортується, причому за умовчуванням.
 */
export default App;
