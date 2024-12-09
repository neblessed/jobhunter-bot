import {UserFilterType} from "../controllers/filter/types/filter.type";
import {FilterAlias} from "./filter-alias";

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

    validateByUserFilter(message: string, filter: UserFilterType, aliases: FilterAlias) {
        const messageLower = message.toLowerCase();
        const {position, grade, type} = filter;
        const positionAliases = aliases.positions[position as keyof typeof aliases.positions];
        const gradeAliases = aliases.grades[grade as keyof typeof aliases.grades];
        const employmentTypeAliases = aliases.employmentTypes[type as keyof typeof aliases.employmentTypes];

        const positionMatch = positionAliases.some(alias => messageLower.includes(alias.toLowerCase()));
        const gradeMatch = gradeAliases.some(alias => messageLower.includes(alias.toLowerCase()));
        const employmentTypeMatch = employmentTypeAliases.some(alias => messageLower.includes(alias.toLowerCase()));

        return positionMatch && gradeMatch && employmentTypeMatch;
    }
}

export const validator = new MessageValidator();