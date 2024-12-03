import {ConfigService} from "./config/config.service";
import {IConfigService} from "./config/config.interface";
import {Telegraf} from "telegraf";
import {IBotContext} from "./context/context.interface";
import {Command} from "./command/command";
import {MessageHandler} from "./command/message-handler";
import LocalSession from 'telegraf-session-local'

export class JobHunterBot {
    bot: Telegraf<IBotContext>
    commands: Command[] = [];

    constructor(private readonly config: IConfigService) {
        this.bot = new Telegraf<any>(this.config.get('TOKEN'));
        this.bot.use(new LocalSession({database: 'sessions.json'}).middleware())
    }

    init() {
        this.commands = [new MessageHandler(this.bot)]

        for (const command of this.commands) {
            command.handle();
        }

        this.bot.launch();
    }
}

const bot = new JobHunterBot(new ConfigService());
bot.init();
console.log('bot is running now👌🏼')
