import {Markup} from "telegraf";

export class Menu{
    mainMenu = Markup.keyboard([['Включить приём вакансий ▶'], ['Создать фильтр 📟', 'Мой фильтр ⚡'], ['Сбросить фильтр 🗑']]).resize();
}