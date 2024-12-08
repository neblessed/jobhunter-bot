import {Telegraf} from "telegraf";
import {IBotContext} from "./context/context.interface";
import {Command} from "./command/command";
import {MessageHandler} from "./command/message-handler";
import LocalSession from 'telegraf-session-local'
import {AuthController} from './controllers/auth/auth.controller';

export class JobHunterBot {
    bot: Telegraf<IBotContext>
    commands: Command[] = [];
    auth = new AuthController();

    constructor() {
        this.bot = new Telegraf<any>(process.env.TOKEN!);
        this.bot.use(new LocalSession({database: 'sessions.json'}).middleware())
    }

    init() {
        this.commands = [new MessageHandler(this.bot)]

        for (const command of this.commands) {
            command.handle();
        }

        this.bot.launch();
        // this.auth.signInIfNeeded();
    }
}

const bot = new JobHunterBot();
bot.init();
console.log('bot is running now👌🏼')
