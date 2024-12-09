import * as cron from 'node-cron';
import {FilterController} from "../controllers/filter/filter.controller";
import {MessageFetchController} from "../controllers/fetcher/message-fetch.controller";
import {FetchMessageType} from "../types/fetch-message.type";
import {validator} from "../utils/message-validator";

export class Scheduler {
    private filterController = new FilterController();

    dailyFetchMessages(userId: number) {

        // Ежедневное обновление сообщений
        cron.schedule('* * * * *', async () => {
            const filter = this.filterController.getUserFilterFromStorage(userId);

            if (filter) {
                console.log('cron starting');
                const fetcher = new MessageFetchController(filter);
                let channelsMessages: Array<FetchMessageType[]> = [];

                for (const channel of filter.channels) {
                    const messages = await fetcher.getLatestDayMessages(channel);
                    channelsMessages.push(messages);
                    console.log(`from channel "${channel}" parsed ${messages.length} messages`);
                }

                let channel: string;
                let validMessages: string[] = [];
                for (const channelMessagesArray of channelsMessages) {
                    for (const entity of channelMessagesArray) {
                        if (validator.validateByUserFilter(entity.message, filter)) {
                            channel = entity.channel
                            validMessages.push(entity.message)
                        }
                    }
                }

                console.log('cron parsing finished');
                console.log('parsed filtered messages quantity:', validMessages.length);
            }
        });
    }
}