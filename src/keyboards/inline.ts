import {Markup} from "telegraf";
import {actions} from "../utils/actions/filter.actions";

export class InlineKeyboards {
    position = Markup.inlineKeyboard([[
        Markup.button.callback('QA Engineer', actions.position.qa),
        Markup.button.callback('QA Automation', actions.position.aqa)
    ],
        [
            Markup.button.callback('Frontend Developer', actions.position.feDev),
            Markup.button.callback('Backend Developer', actions.position.beDev)
        ]
    ]);

    grade = Markup.inlineKeyboard([
        [
            Markup.button.callback('Trainee', actions.grade.trainee),
            Markup.button.callback('Junior', actions.grade.junior),
            Markup.button.callback('Middle', actions.grade.middle),
            Markup.button.callback('Senior', actions.grade.senior),
            Markup.button.callback('Lead', actions.grade.lead)
        ]
    ]);

    location = Markup.inlineKeyboard([
        [Markup.button.callback('Не важно', actions.location.noMatter)],
        [
            Markup.button.callback('Россия', actions.location.ru),
            Markup.button.callback('Беларусь', actions.location.rb)
        ],
        [
            Markup.button.callback('Казахстан', actions.location.kz),
            Markup.button.callback('Сербия', actions.location.rs)
        ],
        [
            Markup.button.callback('Турция', actions.location.tr),
            Markup.button.callback('Германия', actions.location.de)
        ],
        [
            Markup.button.callback('Великобритания', actions.location.uk),
            Markup.button.callback('США', actions.location.usa)
        ]
    ]);

    type = Markup.inlineKeyboard([
        [Markup.button.callback('Не важно', actions.type.noMatter)],
        [
            Markup.button.callback('Удаленно', actions.type.remote),
            Markup.button.callback('Гибрид', actions.type.hybrid)
        ],
        [Markup.button.callback('Офис', actions.type.office)]
    ]);

    salary = Markup.inlineKeyboard([
        [Markup.button.callback('Не важно', actions.salary.noMatter)],
        [Markup.button.callback('50-80k RUB', actions.salary.k80)],
        [Markup.button.callback('90-120k RUB', actions.salary.k150)],
        [Markup.button.callback('120-150k RUB', actions.salary.k250)]
    ]);

    programmingLanguage = Markup.inlineKeyboard([
        [
            Markup.button.callback('Java', actions.programmingLanguage.java),
            Markup.button.callback('Python', actions.programmingLanguage.python)
        ],
        [
            Markup.button.callback('JavaScript', actions.programmingLanguage.jsTs),
            Markup.button.callback('Kotlin', actions.programmingLanguage.kotlin)
        ],
        [
            Markup.button.callback('Golang', actions.programmingLanguage.golang),
            Markup.button.callback('C', actions.programmingLanguage.c)
        ],
        [Markup.button.callback('Пропустить', actions.programmingLanguage.noMatter)]
    ]);
}