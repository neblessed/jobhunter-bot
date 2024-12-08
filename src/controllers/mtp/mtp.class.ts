import {tgConfig} from "../auth/admin-config";
import {TelegramClient} from "telegram";
import {StoreSession} from "telegram/sessions";

export class Mtp {
    private static instance: TelegramClient;

    static getInstance(): TelegramClient {
        if (!Mtp.instance) {
            Mtp.instance = new TelegramClient(new StoreSession('admin-sessions'), tgConfig.telegram.id, tgConfig.telegram.hash!, {connectionRetries: 1});
        }
        return Mtp.instance;
    }
}