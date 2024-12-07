import {InlineKeyboards} from "../keyboards/inline";
import {Context, Markup} from "telegraf";
import {UserFilterType} from "../controllers/filter/types/filter.type";

export class FilterMessages {
    private inlineKeyboards = new InlineKeyboards();

    jobPosition(ctx: Context) {
        ctx.reply('Какие вакансии ищем?', this.inlineKeyboards.position);
    }

    grade(ctx: Context) {
        ctx.editMessageText('Ваш грейд:', this.inlineKeyboards.grade);
    }

    type(ctx: Context) {
        ctx.editMessageText('Формат работы:', this.inlineKeyboards.type)
    }

    location(ctx: Context) {
        ctx.editMessageText('Предпочитаемая локация:', this.inlineKeyboards.location)
    }

    salary(ctx: Context) {
        ctx.editMessageText('Предпочитаемая зарплата:', this.inlineKeyboards.salary)
    }

    programmingLanguage(ctx: Context) {
        ctx.editMessageText('Выберите один из языков программирования, которым владеете:', this.inlineKeyboards.programmingLanguage)
    }

    filterResult(ctx: Context, filter: UserFilterType) {
        ctx.editMessageText(`Создать ваш фильтр?\n\nПозиция: ${filter.position}\nГрейд: ${filter.grade}\nТип занятости: ${filter.type}\nЗП: ${filter.salary}\nЛокация: ${filter.location}\nЯП: ${filter.lang}`, Markup.inlineKeyboard([Markup.button.callback('Да', 'create-filter'), Markup.button.callback('Нет', 'revoke-filter')]))
    }
}