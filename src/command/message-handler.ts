import {Command} from "./command";
import {Markup, Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {Menu} from "../keyboards/menu";
import {FilterMessages} from "../messages/filter-messages";
import {actions} from "../utils/actions/filter.actions";

export class MessageHandler extends Command {
    private menu = new Menu();
    private filterMessages = new FilterMessages();
    private filter = {} as {
        position: string,
        grade: string,
        location: string,
        type: string,
        salary: string,
        programmingLanguage: string,
    };

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.start((ctx) => {
            ctx.reply('Привет, воспользуйся меню 👇🏼', this.menu.mainMenu)
        })

        this.bot.hears('Включить приём вакансий ▶️', (ctx) => {
            ctx.reply('Прием вакансий включен ✔', Markup.keyboard(['Остановить поиск вакансий ⏸']))
        })

        this.bot.hears('Мой фильтр ⚡️', (ctx) => {
            ctx.reply('your filter: ')
            ctx.reply(JSON.stringify(this.filter))
        })

        this.bot.hears('Создать фильтр 📟', async (ctx) => {
            await this.filterMessages.jobPosition(ctx);

            this.bot.action(actions.position.qa, async (ctx) => {
                this.filter.position = actions.position.qa
                await this.filterMessages.grade(ctx);
            })

            this.bot.action(actions.position.aqa, async (ctx) => {
                this.filter.position = actions.position.aqa
                await this.filterMessages.grade(ctx);
            })

            this.bot.action(actions.position.feDev, async (ctx) => {
                this.filter.position = actions.position.feDev
                await this.filterMessages.grade(ctx);
            })

            this.bot.action(actions.position.beDev, async (ctx) => {
                this.filter.position = actions.position.beDev
                await this.filterMessages.grade(ctx);
            })
        });
    }
}