import {UserFilterType} from "../types/filter.type";
import {FilterAlias} from "./filter-alias";
import {FilterController} from "../controllers/filter/filter.controller";

class MessageValidator {
    private regexp = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

    parseChannelsFromMessage(message: string): string[] | string {
        let channels: string[] | string = [];
        message.split('\n').forEach(channel => {
            const c = channel.replace('@', '').trim();
            if (this.regexp.test(c)) {
                (channels as string[]).push(c);
            } else {
                channels = '❗ Ошибка парсинга каналов\nПроверьте что в сообщении не содержится ошибок';
            }
        })

        return channels;
    }

    validateByUserFilter(message: string, filter: UserFilterType) {
        const filterController = new FilterController();
        const messageLower = message.toLowerCase();
        const aliases = filterController.getAliasesByFilter(filter);

        const positionMatch = aliases.position.some(alias => messageLower.includes(alias.toLowerCase()));
        const gradeMatch = aliases.grade.some(alias => messageLower.includes(alias.toLowerCase()));
        const employmentTypeMatch = aliases.employmentType.some(alias => messageLower.includes(alias.toLowerCase()));
        const langTypeMatch = aliases.programmingLanguage.some(alias => messageLower.includes(alias.toLowerCase()));

        return positionMatch && gradeMatch && employmentTypeMatch && langTypeMatch;
    }
}

export const validator = new MessageValidator();