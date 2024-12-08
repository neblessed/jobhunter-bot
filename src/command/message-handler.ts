import {Command} from "./command";
import {Markup, Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {Menu} from "../keyboards/menu";
import {FilterMessages} from "../messages/filter-messages";
import {actions} from "../utils/actions/filter.actions";
import {FilterController} from "../controllers/filter/filter.controller";
import {adminUsernames} from "../controllers/auth/admin-settings";
import {channels} from "../utils/channels/channel-mapping";


export class MessageHandler extends Command {
    private menu = new Menu();
    private filterMessages = new FilterMessages();
    private filterController = new FilterController();

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        /**
         * start
         */
        this.bot.start((ctx) => {
            ctx.reply(`Привет ${ctx.from.first_name}! Воспользуйся меню 👇🏼`, this.menu.mainMenu)
        })

        /**
         * Обработка команды "Включить поиск вакансий ▶"
         */
        this.bot.hears('Включить поиск вакансий ▶', (ctx) => {
            const userFilter = this.filterController.getUserFilterFromStorage(ctx.chat.id);
            if (userFilter) {
                ctx.reply('Поиск активирован ✔', Markup.keyboard(['Остановить поиск ⏸']).resize());

                this.bot.hears('Остановить поиск ⏸', (ctx) => {
                    ctx.reply('Поиск приостановлен ✔', this.menu.mainMenu);
                })
            } else {
                ctx.reply('Вы ещё не создали ни одного фильтра ❌');
            }
        });

        /**
         * Обработка команды "Фильтр ⚡"
         */
        this.bot.hears('Фильтр ⚡', (hearsCtx) => {
            hearsCtx.reply('Панель управления фильтрами 🛰', this.menu.filterMenu);

            /**
             * Обработка команды "Показать фильтр 👀"
             */
            this.bot.hears('Показать фильтр 👀', (ctx) => {
                const userId = ctx.update.message.from.id;
                const userFilter = this.filterController.getUserFilterFromStorage(userId);

                if (userFilter) {
                    ctx.reply(`Позиция: ${userFilter.position}\nГрейд: ${userFilter.grade}\nТип занятости: ${userFilter.type}\nЗП: ${userFilter.salary}\nЛокация: ${userFilter.location}\nЯП: ${userFilter.lang}`);
                } else {
                    ctx.reply('Вы ещё не создали ни одного фильтра ❌');
                }
            });

            /**
             * Обработка команды "Сбросить фильтр 🗑"
             */
            this.bot.hears('Сбросить фильтр 🗑', (ctx) => {
                ctx.reply('Вы уверены, что хотите удалить фильтр?\n\nУдаленные фильтры восстановлению не подлежат', Markup.inlineKeyboard([Markup.button.callback('Да', 'delete-filter'), Markup.button.callback('Нет', 'discard-filter-delete')]));

                this.bot.action('delete-filter', (ctx) => {
                    this.filterController.deleteInStorage(ctx.chat!.id);
                    ctx.editMessageText('Фильтр удален\nТеперь вы можете создать новый 🌐');
                })

                this.bot.action('discard-filter-delete', (ctx) => {
                    ctx.deleteMessage(ctx.update.callback_query.message!.message_id)
                })
            });
        });

        this.bot.hears('Вернуться в меню 🚪', (ctx) => {
            ctx.reply('Главное меню 🌎', this.menu.mainMenu);
        });


        /**
         * Hear command "Создать фильтр 📟" and handle all actions
         * Here is creating user filter
         */
        this.bot.hears('Создать фильтр 📟', (ctx) => {
            const userId = ctx.chat.id;
            const userFilter = this.filterController.getUserFilterFromStorage(userId);

            if (userFilter) {
                ctx.reply('У вас уже имеется созданный фильтр. Удалите его, прежде чем создать новый ⚙');
            } else {
                this.filterMessages.jobPosition(ctx);
                /**
                 * Handle "position" actions
                 */
                this.bot.action(actions.position.qa, (ctx) => {
                    this.filterController.addKeyInFilter('user_id', userId)
                    this.filterController.addKeyInFilter('position', 'QA Engineer');
                    this.filterController.addKeyInFilter('baseChannels', channels.qaChannels);
                    this.filterMessages.grade(ctx);
                });
                this.bot.action(actions.position.aqa, (ctx) => {
                    this.filterController.addKeyInFilter('user_id', userId)
                    this.filterController.addKeyInFilter('position', 'QA Automation');
                    this.filterController.addKeyInFilter('baseChannels', channels.aqaChannels);
                    this.filterMessages.grade(ctx);
                });
                this.bot.action(actions.position.feDev, (ctx) => {
                    this.filterController.addKeyInFilter('user_id', userId)
                    this.filterController.addKeyInFilter('position', 'Frontend Developer');
                    this.filterController.addKeyInFilter('baseChannels', channels.feDevChannels);
                    this.filterMessages.grade(ctx);
                });
                this.bot.action(actions.position.beDev, (ctx) => {
                    this.filterController.addKeyInFilter('user_id', userId)
                    this.filterController.addKeyInFilter('position', 'Backend Developer');
                    this.filterController.addKeyInFilter('baseChannels', channels.beDevChannels);
                    this.filterMessages.grade(ctx);
                });

                /**
                 * Handle "grade" actions
                 */
                this.bot.action(actions.grade.trainee, (ctx) => {
                    this.filterController.addKeyInFilter('grade', 'Trainee');
                    this.filterMessages.type(ctx);
                });
                this.bot.action(actions.grade.junior, (ctx) => {
                    this.filterController.addKeyInFilter('grade', 'Junior');
                    this.filterMessages.type(ctx);
                });
                this.bot.action(actions.grade.middle, (ctx) => {
                    this.filterController.addKeyInFilter('grade', 'Middle');
                    this.filterMessages.type(ctx);
                });
                this.bot.action(actions.grade.senior, (ctx) => {
                    this.filterController.addKeyInFilter('grade', 'Senior');
                    this.filterMessages.type(ctx);
                });
                this.bot.action(actions.grade.lead, (ctx) => {
                    this.filterController.addKeyInFilter('grade', 'Lead');
                    this.filterMessages.type(ctx);
                });

                /**
                 * Handle "job type" actions
                 */
                this.bot.action(actions.type.noMatter, (ctx) => {
                    this.filterController.addKeyInFilter('type', 'Не важно');
                    this.filterMessages.location(ctx);
                });
                this.bot.action(actions.type.office, (ctx) => {
                    this.filterController.addKeyInFilter('type', 'Офис');
                    this.filterMessages.location(ctx);
                });
                this.bot.action(actions.type.hybrid, (ctx) => {
                    this.filterController.addKeyInFilter('type', 'Гибрид');
                    this.filterMessages.location(ctx);
                });
                this.bot.action(actions.type.remote, (ctx) => {
                    this.filterController.addKeyInFilter('type', 'Удаленно');
                    this.filterMessages.location(ctx);
                });

                /**
                 * Handle "location" actions
                 */
                this.bot.action(actions.location.noMatter, (ctx) => {
                    this.filterController.addKeyInFilter('location', 'Не важно');
                    this.filterMessages.salary(ctx);
                });
                this.bot.action(actions.location.ru, (ctx) => {
                    this.filterController.addKeyInFilter('location', 'Россия');
                    this.filterMessages.salary(ctx);
                });
                this.bot.action(actions.location.rb, (ctx) => {
                    this.filterController.addKeyInFilter('location', 'Беларусь');
                    this.filterMessages.salary(ctx);
                });
                this.bot.action(actions.location.kz, (ctx) => {
                    this.filterController.addKeyInFilter('location', 'Казахстан');
                    this.filterMessages.salary(ctx);
                });
                this.bot.action(actions.location.rs, (ctx) => {
                    this.filterController.addKeyInFilter('location', 'Сербия');
                    this.filterMessages.salary(ctx);
                });
                this.bot.action(actions.location.tr, (ctx) => {
                    this.filterController.addKeyInFilter('location', 'Турция');
                    this.filterMessages.salary(ctx);
                });
                this.bot.action(actions.location.de, (ctx) => {
                    this.filterController.addKeyInFilter('location', 'Германия');
                    this.filterMessages.salary(ctx);
                });
                this.bot.action(actions.location.uk, (ctx) => {
                    this.filterController.addKeyInFilter('location', 'Великобритания');
                    this.filterMessages.salary(ctx);
                });
                this.bot.action(actions.location.usa, (ctx) => {
                    this.filterController.addKeyInFilter('location', 'США');
                    this.filterMessages.salary(ctx);
                });

                /**
                 * Handle "salary" actions
                 */
                this.bot.action(actions.salary.noMatter, (ctx) => {
                    this.filterController.addKeyInFilter('salary', 'Не важно');
                    this.filterMessages.programmingLanguage(ctx);
                });
                this.bot.action(actions.salary.k80, (ctx) => {
                    this.filterController.addKeyInFilter('salary', 'от 80k RUB');
                    this.filterMessages.programmingLanguage(ctx);
                });
                this.bot.action(actions.salary.k150, (ctx) => {
                    this.filterController.addKeyInFilter('salary', 'от 150k RUB');
                    this.filterMessages.programmingLanguage(ctx);
                });
                this.bot.action(actions.salary.k250, (ctx) => {
                    this.filterController.addKeyInFilter('salary', 'от 250k RUB');
                    this.filterMessages.programmingLanguage(ctx);
                });

                /**
                 * Handle "programming language" actions
                 */
                this.bot.action(actions.lang.noMatter, (ctx) => {
                    this.filterController.addKeyInFilter('lang', 'Не важно');
                    this.filterMessages.filterResult(ctx, this.filterController.getCurrentFilter());
                });
                this.bot.action(actions.lang.java, (ctx) => {
                    this.filterController.addKeyInFilter('lang', 'Java');
                    this.filterMessages.filterResult(ctx, this.filterController.getCurrentFilter());
                });
                this.bot.action(actions.lang.jsTs, (ctx) => {
                    this.filterController.addKeyInFilter('lang', 'JS/TS');
                    this.filterMessages.filterResult(ctx, this.filterController.getCurrentFilter());
                });
                this.bot.action(actions.lang.python, (ctx) => {
                    this.filterController.addKeyInFilter('lang', 'Python');
                    this.filterMessages.filterResult(ctx, this.filterController.getCurrentFilter());
                });
                this.bot.action(actions.lang.kotlin, (ctx) => {
                    this.filterController.addKeyInFilter('lang', 'Kotlin');
                    this.filterMessages.filterResult(ctx, this.filterController.getCurrentFilter());
                });
                this.bot.action(actions.lang.golang, (ctx) => {
                    this.filterController.addKeyInFilter('lang', 'Golang');
                    this.filterMessages.filterResult(ctx, this.filterController.getCurrentFilter());
                });
                this.bot.action(actions.lang.c, (ctx) => {
                    this.filterController.addKeyInFilter('lang', 'C');
                    this.filterMessages.filterResult(ctx, this.filterController.getCurrentFilter());
                });
            }

            /**
             * Handle filter create actions
             */
            this.bot.action('create-filter', (ctx) => {
                try {
                    this.filterController.addInStorage(this.filterController.getCurrentFilter());
                    ctx.editMessageText('Фильтр создан 🎉\nМожете приступать к поиску вакансий!');
                } catch (e) {
                    ctx.editMessageText(`Что-то пошло не так при создании фильтра\nПожалуйста, сообщите об этом администраторам: ${adminUsernames.map(admin => `@${admin} `).join('')}`);
                }

            });
            this.bot.action('revoke-filter', (ctx) => {
                this.filterController.flushCurrentFilter();
                ctx.editMessageText('Фильтр очищен ✔\nВоспользуйтесь меню, чтобы создать его заново.')
            });
        });

        this.bot.hears('Настройки ⚙', (ctx) => {
            ctx.reply('*Добро пожаловать в настройки каналов ✋🏼*\n\nВ этом разделе вы можете:\n◽посмотреть список каналов за которыми следит бот\n◽добавить новый канал\n◽удалить канал из списка', {
                reply_markup: this.menu.settingsMenu.reply_markup,
                parse_mode: 'Markdown'
            });

            /**
             * Обработка запроса списка каналов из фильтра
             */
            this.bot.hears('Мои каналы 📋', (settingsCtx) => {
                const userId = settingsCtx.update.message.from.id;
                const userFilter = this.filterController.getUserFilterFromStorage(userId);

                if (userFilter) {
                    if (userFilter.baseChannels.length >= 1) {
                        const channelsAsText = userFilter.baseChannels.map(c => `\n🎯 @${c}`).join('');
                        settingsCtx.reply(`Для вас бот отслеживает следующие каналы: ${channelsAsText}`)
                    } else {
                        settingsCtx.reply('*Список каналов для отслеживания пуст*\n\nВоспользуйтесь функцией *Добавить ➕*', {parse_mode: 'Markdown'});
                    }
                } else {
                    settingsCtx.reply('Вы ещё не создали ни одного фильтра ❌');
                }
            });

            this.bot.hears('Добавить ➕', (settingsAddCtx) => {
                settingsAddCtx.reply('*Функция добавления канала в список отслеживаемых*\n\n⚠ Каждый канал должен начинаться с новой строки', {
                    reply_markup: Markup.inlineKeyboard([Markup.button.callback('Все равно не понятно 🙁', 'still-idk')]).reply_markup,
                    parse_mode: 'Markdown'
                })

                this.bot.action('still-idk', (idkCtx) => {
                    idkCtx.replyWithVideo({
                        source: 'src/assets/copy-link-example.mp4'
                    }, {
                        caption: 'Юзернейм отображается в профиле любого *публичного* канала\n\n*Например:* ``` https://t.me/test-channel ```В этом примере *test-channel* является юзернеймом канала\n\n```Пример-сообщения-боту\nсhannel1\nchannel2\nchannel3```',
                        parse_mode: 'Markdown'
                    })
                });

                /**
                 * Слушаем сообщение пользователя
                 */
                this.bot.on('text', (updateCtx) => {
                    // TODO wip
                    console.log(updateCtx.message.text)
                })
            })
        })
    }
}