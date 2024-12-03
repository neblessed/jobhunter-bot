import {Command} from "./command";
import {Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";

export class FilterCommand extends Command{
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }
    handle(): void {
        this.bot.start((ctx)=> {
            console.log(ctx);

            ctx.reply('test reply from js')
        })
    }

}