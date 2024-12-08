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
}

export const validator = new MessageValidator();