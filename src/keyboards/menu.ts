import {Markup} from "telegraf";

export class Menu {
    mainMenu = Markup.keyboard([['Фильтр ⚡', 'Настройки ⚙'], ['Включить поиск вакансий ▶']]).resize();
    filterMenu = Markup.keyboard([['Показать фильтр 👀'], ['Создать фильтр 📟', 'Сбросить фильтр 🗑'], ['Вернуться в меню 🚪']]).resize();
}