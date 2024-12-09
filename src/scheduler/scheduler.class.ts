import * as cron from 'node-cron';
import {FilterController} from "../controllers/filter/filter.controller";
import {MessageFetchController} from "../controllers/fetcher/message-fetch.controller";

export class Scheduler {
    private filterController = new FilterController();

    dailyFetchMessages(userId: number) {

        // Ежедневное обновление сообщений
        cron.schedule('0 0 * * *', async () => {
            const filter = this.filterController.getUserFilterFromStorage(userId);
            if (filter) {
                const fetcher = new MessageFetchController(filter);
                const collection: any[] = [];

                for (const channel in filter.channels) {
                    const messages = await fetcher.getLatestDayMessages(channel);
                    collection.push(messages)
                }
            }
        });
    }
}