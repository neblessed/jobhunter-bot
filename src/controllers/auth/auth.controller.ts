import {tgConfig} from "./admin-config";
import {Api, TelegramClient} from "telegram";
import {StoreSession} from "telegram/sessions";
import readline from "readline";
// @ts-ignore
import input from 'input'; // npm install input

export class AuthController {
    private readonly mtp;

    constructor() {
        this.mtp = new TelegramClient(new StoreSession('admin-sessions'), tgConfig.telegram.id, tgConfig.telegram.hash!, {connectionRetries: 1});
    }

    /**
     * Запрашиваем код
     */
    private async sendCode() {
        let codeOrMessage: string | { phoneCodeHash: string };
        try {
            codeOrMessage = await this.mtp.invoke(new Api.auth.SendCode({
                phoneNumber: tgConfig.telegram.phone,
                apiId: tgConfig.telegram.id,
                apiHash: tgConfig.telegram.hash,
                settings: new Api.CodeSettings({
                    allowFlashcall: false,
                    currentNumber: true,
                    allowAppHash: true,
                }),
            })).then((response) => {
                if (response.className === 'auth.SentCode') {
                    return {phoneCodeHash: response.phoneCodeHash}
                } else return 'Ошибка при парсинге успешного ответа'
            });
        } catch (e) {
            codeOrMessage = `Ошибка при отправке кода:\n${(e as Error).message}`
        }
        return codeOrMessage;
    }

    /**
     * Используем полученный код и хэш для авторизации
     */
    private async signIn(phoneCodeHash: string, code: string) {
        this.mtp.invoke(new Api.auth.SignIn({
            phoneCode: code,
            phoneNumber: tgConfig.telegram.phone,
            phoneCodeHash,
        }))
            .then(() => console.log('successful sing in'))
            .catch((e) => console.log(`error in singIn:\n${(e as Error).message}`));
    }

    /**
     * Проверяем, авторизован ли бот
     */
    private async isAuthNeeded() {
        let state;

        try {
            await this.mtp.invoke(new Api.account.GetPassword);
            state = false
        } catch (e) {
            state = true
        }

        return state;
    }

    private async connectWithSaveSession() {
        await this.mtp.start({
            phoneNumber: async () => tgConfig.telegram.phone!,
            phoneCode: async () => {
                return await input.text('type code:');
            },
            onError: (err) => console.log(err),
        });
    }

    /**
     * Авторизуемся, запрашивая код
     */
    async signInIfNeeded() {
        await this.connectWithSaveSession();
        if (await this.isAuthNeeded()) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const response = await this.sendCode();

            if (typeof response === 'string') {
                console.warn(response);
            } else {
                await rl.question('enter code:', async (code) => {
                    await this.signIn(response.phoneCodeHash, code)
                })
            }
        }
    }

    async getLatestMessagesFromChannel(channel: string, limit: number) {
        const peer = await this.mtp.getInputEntity(channel);
        const result = await this.mtp.invoke(
            new Api.messages.GetHistory({
                peer,
                limit,
            })
        );
        if (result.className !== 'messages.MessagesNotModified') {
            return result.messages.map(msg => {
                if (msg.className === 'Message') {
                    return msg.message;
                }
            });
        }
    }
}