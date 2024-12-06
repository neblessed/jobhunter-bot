import {InlineKeyboards} from "../keyboards/inline";
import {Context, Markup} from "telegraf";
import {UserFilterType} from "../controllers/filter/types/filter.type";

export class FilterMessages {
    private inlineKeyboards = new InlineKeyboards();

    jobPosition(ctx: Context) {
        ctx.reply('Какие вакансии ищем?', this.inlineKeyboards.position);
    }

    async grade(ctx: Context) {
        await ctx.editMessageText('Ваш грейд:', this.inlineKeyboards.grade);
    }

    async type(ctx: Context) {
        await ctx.editMessageText('Формат работы:', this.inlineKeyboards.type)
    }

    async location(ctx: Context) {
        await ctx.editMessageText('Предпочитаемая локация:', this.inlineKeyboards.location)
    }

    async salary(ctx: Context) {
        await ctx.editMessageText('Предпочитаемая зарплата:', this.inlineKeyboards.salary)
    }

    async programmingLanguage(ctx: Context) {
        await ctx.editMessageText('Выберите один из языков программирования, которым владеете:', this.inlineKeyboards.programmingLanguage)
    }

    async filterResult(ctx: Context, filter: UserFilterType) {
        await ctx.editMessageText(`Создать ваш фильтр?\n\nПозиция: ${filter.position}\nГрейд: ${filter.grade}\nТип занятости: ${filter.type}\nЗП: ${filter.salary}\nЛокация: ${filter.location}\nЯП: ${filter.lang}`, Markup.inlineKeyboard([Markup.button.callback('Да', 'create-filter'), Markup.button.callback('Нет', 'revoke-filter')]))
    }
}