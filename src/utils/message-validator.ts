class MessageValidator {
    private regexp = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

    parseChannelsFromMessage(message: string): string[] | string {
        let channels: string[] | string = [];
        message.split('\n').forEach(channel => {
            if (this.regexp.test(channel)) {
                (channels as string[]).push(channel);
            } else {
                channels = '❗ Ошибка парсинга каналов\nПроверьте что в сообщении не содержится ошибок';
            }
        })

        return channels;
    }
}

export const validator = new MessageValidator();