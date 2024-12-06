import * as dotenv from 'dotenv'

dotenv.config();

export const tgConfig = {
    telegram: {
        id: Number(process.env.TELEGRAM_APP_ID),
        hash: process.env.TELEGRAM_APP_HASH,
        phone: process.env.TELEGRAM_PHONE_NUMBER,
    },
}