import {tgConfig} from "./admin-config";
import {HunterMTproto} from "../../mtproto/hunter-mtproto";
import {mtMessages} from "../../mtproto/mt-messages";

export class AuthService {
    private readonly mtp;

    constructor() {
        this.mtp = new HunterMTproto({
            api_id: tgConfig.telegram.id,
            api_hash: tgConfig.telegram.hash,
            storageOptions: {
                path: '../storage/storage.json',
            }
        });
    }

    /**
     * Запрашиваем код
     */
    async sendCode() {
        const {phone_code_hash} = await this.mtp.call(mtMessages.sendCode, {
            phone_number: tgConfig.telegram.phone,
            settings: {
                _: 'codeSettings',
            },
        })

        return phone_code_hash;
    }

    /**
     * Используем полученный код и хэш для авторизации
     */
    async signIn(phone_code_hash: string, code: string) {
        return (await this.mtp.call(mtMessages.singIn, {
            phone_code: code,
            phone_number: tgConfig.telegram.phone,
            phone_code_hash,
        }));
    }
}