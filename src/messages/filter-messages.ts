import {InlineKeyboards} from "../keyboards/inline";
import {Context} from "telegraf";

export class FilterMessages {
    private inlineKeyboards = new InlineKeyboards();

    async jobPosition(ctx: Context) {
        await ctx.reply('Какие вакансии ищем?', this.inlineKeyboards.position);
    }

    async grade(ctx: Context) {
        await ctx.editMessageText('Ваш грейд?', this.inlineKeyboards.grade);
    }
}