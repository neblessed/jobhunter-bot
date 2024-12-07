import * as fs from "fs";
import {UserFilterType} from "./types/filter.type";

export class FilterController {
    private path = 'src/storage/user-filters.json';
    userFilter = {} as UserFilterType;

    /**
     * Читает storage
     */
    private readStorage() {
        const data = fs.readFileSync(this.path, 'utf8');

        if (!data) {
            throw new Error(`Error while parse storage (${this.path})`);
        } else {
            return JSON.parse(data).filters as UserFilterType[];
        }
    }

    /**
     * Получает фильтр по userId из storage
     */
    getUserFilterFromStorage(userId: number) {
        const filters = this.readStorage();

        return filters.find(f => f.user_id == userId);
    }

    /**
     * Наполняет текущий фильтр значениями
     */
    addKeyInFilter<K extends keyof UserFilterType, V extends typeof this.userFilter[K]>(key: K, value: V) {
        this.userFilter[key] = value;
    }

    /**
     * Перезаписывает storage
     */
    private updateStorage(filters: { filters: UserFilterType[] }) {
        fs.writeFile(this.path, JSON.stringify(filters, null, 2), 'utf8', writeErr => {
            if (writeErr) {
                console.error('Ошибка при записи файла:', writeErr);
            } else {
                console.log('Фильтр успешно обновлен');
            }
        });
    }

    /**
     * Перезаписывает storage, добавляет новый фильтр в массив
     */
    addInStorage(filter: UserFilterType) {
        const filters = this.readStorage();
        filters.push(filter);
        this.updateStorage({filters});
    }

    /**
     * Удаляет из storage фильтр по userId
     */
    deleteInStorage(userId: number) {
        const filters = this.readStorage().filter(f => f.user_id !== userId);
        this.updateStorage({filters});
    }

    /**
     * Получает текущий wip-фильтр
     */
    getCurrentFilter() {
        return this.userFilter;
    }

    /**
     * Очищает текущий wip-фильтр
     */
    flushCurrentFilter(){
        Object.keys(this.userFilter).forEach(key => {
            // @ts-ignore
            delete this.userFilter[key];
        });
    }
}