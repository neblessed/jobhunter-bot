import {tgConfig} from "./admin-config";
import {Api, TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions";

export class AuthController {
    private readonly mtp;

    constructor() {
        this.mtp = new TelegramClient(new StringSession(''), tgConfig.telegram.id, tgConfig.telegram.hash!, {connectionRetries: 1});
        this.mtp.connect();
    }

    /**
     * Запрашиваем код
     */
    async sendCode() {
        let codeOrMessage: string | { phoneCodeHash: string };
        try {
            codeOrMessage = await this.mtp.invoke(new Api.auth.SendCode({
                phoneNumber: tgConfig.telegram.phone,
                apiId: tgConfig.telegram.id,
                apiHash: tgConfig.telegram.hash,
                settings: new Api.CodeSettings({
                    allowFlashcall: false,
                    currentNumber: false,
                    allowAppHash: false,
                }),
            })).then(async (response) => {
                if (response.className === 'auth.SentCode') {
                    return {phoneCodeHash: response.phoneCodeHash}
                } else return 'Ошибка при парсинге успешного ответа'
            });
        } catch (e) {
            codeOrMessage = 'Ошибка при отправке кода'
        }
        return codeOrMessage;
    }


    /**
     * Используем полученный код и хэш для авторизации
     */
    async signIn(phoneCodeHash: string, code: string) {
        return (await this.mtp.invoke(new Api.auth.SignIn({
            phoneCode: code,
            phoneNumber: tgConfig.telegram.phone,
            phoneCodeHash,
        })));
    }

    async isAuthNeeded() {
        let state;

        try {
            await this.mtp.invoke(new Api.account.GetPassword);
            state = false
        } catch (e) {
            state = true
        }

        return state;
    }
}