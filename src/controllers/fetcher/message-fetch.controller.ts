import {UserFilterType} from "../filter/types/filter.type";
import {Mtp} from "../mtp/mtp.class";
import {Api} from "telegram";
import {SECONDS_IN_DAY} from "../../utils/constants/time";

export class MessageFetchController {
    private readonly mtp = Mtp.getInstance();
    private readonly filter: UserFilterType;

    constructor(userFilter: UserFilterType) {
        this.filter = userFilter;
    }

    /**
     * Получает сообщения из переданного канала за последние 24 часа.
     * Возвращает массив с информацией:
     * [канал, время сообщения, текст сообщения]
     */
    async getLatestDayMessages(channel: string, limit = 50) {
        const messages: any[] = [];
        const now = Date.now();

        try {
            const peer = await this.mtp.getInputEntity(channel);
            const result = await this.mtp.invoke(
                new Api.messages.GetHistory({
                    peer,
                    limit,
                })
            );

            if (result.className !== 'messages.MessagesNotModified') {
                result.messages.forEach(msg => {
                    if (msg.className === 'Message') {
                        if (msg.message.length > 5) {
                            if (msg.date >= Math.round((now - (SECONDS_IN_DAY * 1000)) / 1000)) {
                                messages.push([channel, msg.date, msg.message]);
                            }
                        }
                    }
                });
            }
            return messages;
        } catch (e) {

        }

        return messages;
    }
}