import {tgConfig} from "./admin-config";
import {Api, TelegramClient} from "telegram";
import {StoreSession, StringSession} from "telegram/sessions";
import readline from "readline";
import fs from "fs";

export class AuthController {
    private readonly path = `src/storage/admin-sessions.json`;
    private readonly mtp;
    private readonly stringSession = new StringSession('');

    constructor() {
        // this.mtp = this.createStringSession();
        this.mtp = new TelegramClient(this.stringSession, tgConfig.telegram.id, tgConfig.telegram.hash!, {connectionRetries: 1});
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
        await this.mtp.connect();
        this.addInStorageIfNotExists(this.stringSession.save());

        const storeSession = new StoreSession("my_session");
        console.log(storeSession.save())
    }

    /**
     * Авторизуемся, запрашивая код
     */
    async signInIfNeeded() {
        // await this.connectWithSaveSession();
        await this.mtp.connect();
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

    private getLatestSessionIfExists() {
        const {sessions} = this.readStorage();

        return sessions.at(-1);
    }

    private createStringSession() {
        const exists = this.getLatestSessionIfExists();
        if (exists) {
            console.log('found created session')
            return new TelegramClient(new StringSession(exists), tgConfig.telegram.id, tgConfig.telegram.hash!, {connectionRetries: 1});
        } else {
            return new TelegramClient(this.stringSession, tgConfig.telegram.id, tgConfig.telegram.hash!, {connectionRetries: 1});
        }
    }

    private addInStorageIfNotExists(session: string) {
        const {sessions} = this.readStorage();

        if (!sessions.includes(session)) {
            sessions.push(session);
            this.updateStorage(sessions);
        }
    }

    /**
     * Перезаписывает storage
     */
    private updateStorage(sessions: string[]) {
        fs.writeFile(this.path, JSON.stringify({sessions}, null, 2), 'utf8', writeErr => {
            if (writeErr) {
                console.error('Ошибка при записи файла:', writeErr);
            } else {
                console.log('Сессии обновлены');
            }
        });
    }

    /**
     * Читает storage
     */
    private readStorage(): { sessions: string[] } {
        const data = fs.readFileSync(this.path, 'utf8');

        if (!data) {
            throw new Error(`Error while parse storage (${this.path})`);
        } else {
            return JSON.parse(data);
        }
    }
}