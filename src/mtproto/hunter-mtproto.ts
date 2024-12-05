// @ts-ignore
const MTProto = require('@mtproto/core');

export class HunterMTproto {
    private mtp;

    constructor(options: {
        api_id: string | undefined,
        api_hash: string | undefined,
        storageOptions?: {
            path: string
        }
    }) {
        this.mtp = new MTProto(options);
    }

    async call(method: string, params?: Record<any, any>, options?: Record<any, any>) {
        try {
            return (await this.mtp.call(method, params, options));
        } catch (e) {
            console.warn(`Возникла ошибка при отправке сообщения:\n${(e as Error).message}`)
        }
    }
}