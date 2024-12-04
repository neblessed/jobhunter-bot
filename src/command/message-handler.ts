import {Command} from "./command";
import {Markup, Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {Menu} from "../keyboards/menu";
import {FilterMessages} from "../messages/filter-messages";
import {actions} from "../utils/actions/filter.actions";
import {FilterType} from "../utils/types/filter.type";

export class MessageHandler extends Command {
    private menu = new Menu();
    private filterMessages = new FilterMessages();
    private filter = {} as FilterType;

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        /**
         * Response when user start bot
         */
        this.bot.start((ctx) => {
            ctx.reply('Привет, воспользуйся меню 👇🏼', this.menu.mainMenu)
        })

        /**
         * Hear command "Включить приём вакансий ▶"
         * Show error when filter is not created yet
         */
        this.bot.hears('Включить приём вакансий ▶', (ctx) => {
            if (!this.filter.position) {
                ctx.reply('Вы ещё не создали ни одного фильтра ❌');
            } else {
                ctx.reply('Прием вакансий включен ✔', Markup.keyboard(['Остановить поиск вакансий ⏸']).resize());

                this.bot.hears('Остановить поиск вакансий ⏸', (ctx) => {
                    ctx.reply('Прием вакансий отключен ✔', this.menu.mainMenu);
                })
            }
        })

        /**
         * Hear command "Мой фильтр ⚡"
         * Show error when filter is not created yet
         */
        this.bot.hears('Мой фильтр ⚡', (ctx) => {
            if (this.filter.position) {
                ctx.reply(`Ваш фильтр:\n\nПозиция: ${this.filter.position}\nГрейд: ${this.filter.grade}\nТип занятости: ${this.filter.type}\nЗП: ${this.filter.salary}\nЛокация: ${this.filter.location}\nЯП: ${this.filter.lang}`);
            } else {
                ctx.reply('Вы ещё не создали ни одного фильтра ❌');
            }
        })

        /**
         * Clear current filter
         */
        this.bot.hears('Сбросить фильтр 🗑', async (ctx) => {
            await ctx.reply('Вы уверены, что хотите удалить фильтр?\n\nУдаленные фильтры восстановлению не подлежат', Markup.inlineKeyboard([Markup.button.callback('Да', 'delete-filter'), Markup.button.callback('Нет', 'discard-filter-delete')]));

            this.bot.action('delete-filter', async (ctx) => {
                Object.keys(this.filter).forEach(key => {
                    // @ts-ignore
                    delete this.filter[key];
                });
                await ctx.editMessageText('Фильтр удален\n\nТеперь вы можете создать новый 🌐');
            })

            this.bot.action('discard-filter-delete', async (ctx) => {
                await ctx.deleteMessage(ctx.update.callback_query.message!.message_id)
            })
        });

        /**
         * Hear command "Создать фильтр 📟" and handle all actions
         * Here is creating user filter
         */
        this.bot.hears('Создать фильтр 📟', (ctx) => {
            this.filterMessages.jobPosition(ctx);

            /**
             * Handle "position" actions
             */
            this.bot.action(actions.position.qa, async (ctx) => {
                this.filter.position = 'QA Engineer'
                await this.filterMessages.grade(ctx);
            });
            this.bot.action(actions.position.aqa, async (ctx) => {
                this.filter.position = 'QA Automation'
                await this.filterMessages.grade(ctx);
            });
            this.bot.action(actions.position.feDev, async (ctx) => {
                this.filter.position = 'Frontend Developer'
                await this.filterMessages.grade(ctx);
            });
            this.bot.action(actions.position.beDev, async (ctx) => {
                this.filter.position = 'Backend Developer'
                await this.filterMessages.grade(ctx);
            });

            /**
             * Handle "grade" actions
             */
            this.bot.action(actions.grade.trainee, async (ctx) => {
                this.filter.grade = 'Trainee';
                await this.filterMessages.type(ctx);
            });
            this.bot.action(actions.grade.junior, async (ctx) => {
                this.filter.grade = 'Junior';
                await this.filterMessages.type(ctx);
            });
            this.bot.action(actions.grade.middle, async (ctx) => {
                this.filter.grade = 'Middle';
                await this.filterMessages.type(ctx);
            });
            this.bot.action(actions.grade.senior, async (ctx) => {
                this.filter.grade = 'Senior';
                await this.filterMessages.type(ctx);
            });
            this.bot.action(actions.grade.lead, async (ctx) => {
                this.filter.grade = 'Lead';
                await this.filterMessages.type(ctx);
            });

            /**
             * Handle "job type" actions
             */
            this.bot.action(actions.type.noMatter, async (ctx) => {
                this.filter.type = 'Не важно';
                await this.filterMessages.location(ctx);
            });
            this.bot.action(actions.type.office, async (ctx) => {
                this.filter.type = 'Офис';
                await this.filterMessages.location(ctx);
            });
            this.bot.action(actions.type.hybrid, async (ctx) => {
                this.filter.type = 'Гибрид';
                await this.filterMessages.location(ctx);
            });
            this.bot.action(actions.type.remote, async (ctx) => {
                this.filter.type = 'Удаленно';
                await this.filterMessages.location(ctx);
            });

            /**
             * Handle "location" actions
             */
            this.bot.action(actions.location.noMatter, async (ctx) => {
                this.filter.location = 'Не важно';
                await this.filterMessages.salary(ctx);
            });
            this.bot.action(actions.location.ru, async (ctx) => {
                this.filter.location = 'Россия';
                await this.filterMessages.salary(ctx);
            });
            this.bot.action(actions.location.rb, async (ctx) => {
                this.filter.location = 'Беларусь';
                await this.filterMessages.salary(ctx);
            });
            this.bot.action(actions.location.kz, async (ctx) => {
                this.filter.location = 'Казахстан';
                await this.filterMessages.salary(ctx);
            });
            this.bot.action(actions.location.rs, async (ctx) => {
                this.filter.location = 'Сербия';
                await this.filterMessages.salary(ctx);
            });
            this.bot.action(actions.location.tr, async (ctx) => {
                this.filter.location = 'Турция';
                await this.filterMessages.salary(ctx);
            });
            this.bot.action(actions.location.de, async (ctx) => {
                this.filter.location = 'Германия';
                await this.filterMessages.salary(ctx);
            });
            this.bot.action(actions.location.uk, async (ctx) => {
                this.filter.location = 'Великобритания';
                await this.filterMessages.salary(ctx);
            });
            this.bot.action(actions.location.usa, async (ctx) => {
                this.filter.location = 'США';
                await this.filterMessages.salary(ctx);
            });

            /**
             * Handle "salary" actions
             */
            this.bot.action(actions.salary.noMatter, async (ctx) => {
                this.filter.salary = 'Не важно';
                await this.filterMessages.programmingLanguage(ctx);
            });
            this.bot.action(actions.salary.k80, async (ctx) => {
                this.filter.salary = 'от 80k RUB';
                await this.filterMessages.programmingLanguage(ctx);
            });
            this.bot.action(actions.salary.k150, async (ctx) => {
                this.filter.salary = 'от 150k RUB';
                await this.filterMessages.programmingLanguage(ctx);
            });
            this.bot.action(actions.salary.k250, async (ctx) => {
                this.filter.salary = 'от 250k RUB';
                await this.filterMessages.programmingLanguage(ctx);
            });

            /**
             * Handle "programming language" actions
             */
            this.bot.action(actions.lang.noMatter, async (ctx) => {
                this.filter.lang = 'Не важно';
                await this.filterMessages.filterResult(ctx, this.filter);
            });
            this.bot.action(actions.lang.java, async (ctx) => {
                this.filter.lang = 'Java';
                await this.filterMessages.filterResult(ctx, this.filter);
            });
            this.bot.action(actions.lang.jsTs, async (ctx) => {
                this.filter.lang = 'JS/TS';
                await this.filterMessages.filterResult(ctx, this.filter);
            });
            this.bot.action(actions.lang.python, async (ctx) => {
                this.filter.lang = 'Python';
                await this.filterMessages.filterResult(ctx, this.filter);
            });
            this.bot.action(actions.lang.kotlin, async (ctx) => {
                this.filter.lang = 'Kotlin';
                await this.filterMessages.filterResult(ctx, this.filter);
            });
            this.bot.action(actions.lang.golang, async (ctx) => {
                this.filter.lang = 'Golang';
                await this.filterMessages.filterResult(ctx, this.filter);
            });
            this.bot.action(actions.lang.c, async (ctx) => {
                this.filter.lang = 'C';
                await this.filterMessages.filterResult(ctx, this.filter);
            });

            /**
             * Handle filter create actions
             */
            this.bot.action('create-filter', async (ctx) => {
                await ctx.editMessageText('Фильтр создан 🎉\nМожете приступать к поиску вакансий!')
            });
            this.bot.action('revoke-filter', async (ctx) => {
                await ctx.editMessageText('Фильтр очищен ✔\nВоспользуйтесь меню, чтобы создать его заново.')
            });
        });
    }
}