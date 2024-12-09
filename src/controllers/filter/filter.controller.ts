import * as fs from "fs";
import {UserFilterType} from "../../types/filter.type";
import {FilterAlias} from "../../utils/filter-alias";
import {actions} from "../../utils/actions/filter.actions";

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
    flushCurrentFilter() {
        Object.keys(this.userFilter).forEach(key => {
            // @ts-ignore
            delete this.userFilter[key];
        });
    }

    addUserChannels(userId: number, newChannels: string[]) {
        const filters = this.readStorage();
        const userFilter = filters.find(f => f.user_id == userId)!;
        const {channels} = userFilter;

        newChannels.forEach(channel => {
            if (!channels.includes(channel)) {
                channels.push(channel);
            }
        });
        filters.map(filter => {
            if (filter.user_id == userId) {
                filter.channels = channels;
                return filter;
            }
        })

        this.updateStorage({filters})
    }

    removeUserChannels(userId: number, updatedChannels: string[]): void | string {
        const filters = this.readStorage();
        const userFilter = filters.find(f => f.user_id == userId)!;
        let {channels} = userFilter;
        const isExists = channels.some(item => updatedChannels.includes(item));

        if (isExists) {
            channels = channels.filter(channel => {
                if (!updatedChannels.includes(channel)) {
                    return channel;
                }
            });

            filters.map(filter => {
                if (filter.user_id == userId) {
                    filter.channels = channels;
                    return filter;
                }
            })

            this.updateStorage({filters})
        }
    }

    getAliasesByFilter(filter: UserFilterType) {
        const alias = new FilterAlias();
        const {position, grade, type, lang} = filter;
        const aliases = {} as {
            position: string[],
            grade: string[],
            employmentType: string[],
            programmingLanguage: string[]
        };

        switch (position) {
            case 'QA Engineer': {
                aliases.position = alias.positions.QA;
                break;
            }
            case 'QA Automation': {
                aliases.position = alias.positions.AQA;
                break;
            }
            case 'Frontend Developer': {
                aliases.position = alias.positions.Frontend;
                break;
            }
            case 'Backend Developer': {
                aliases.position = alias.positions.Backend;
                break;
            }
        }

        switch (grade) {
            case 'Trainee': {
                aliases.grade = alias.grades.TRAINEE;
                break;
            }
            case 'Junior': {
                aliases.grade = alias.grades.JUNIOR;
                break;
            }
            case 'Middle': {
                aliases.grade = alias.grades.MIDDLE;
                break;
            }
            case 'Senior': {
                aliases.grade = alias.grades.SENIOR;
                break;
            }
            case 'Lead': {
                aliases.grade = alias.grades.LEAD;
                break;
            }
        }

        switch (type) {
            case 'Не важно': {
                aliases.employmentType = [];
                break;
            }
            case 'Офис': {
                aliases.employmentType = alias.employmentTypes.OFFICE;
                break;
            }
            case 'Гибрид': {
                aliases.employmentType = alias.employmentTypes.HYBRID;
                break;
            }
            case 'Удаленно': {
                aliases.employmentType = alias.employmentTypes.REMOTE;
                break;
            }
        }

        switch (lang) {
            case 'Не важно': {
                aliases.employmentType = [];
                break;
            }
            case 'Java': {
                aliases.programmingLanguage = alias.languages.JAVA;
                break;
            }
            case 'JS/TS': {
                aliases.programmingLanguage = alias.languages.JAVASCRIPT_TYPESCRIPT;
                break;
            }
            case 'Python': {
                aliases.programmingLanguage = alias.languages.PYTHON;
                break;
            }
            case 'Kotlin': {
                aliases.programmingLanguage = alias.languages.KOTLIN;
                break;
            }
            case 'Golang': {
                aliases.programmingLanguage = alias.languages.GOLANG;
                break;
            }
            case 'C': {
                aliases.programmingLanguage = alias.languages.C;
                break;
            }
        }

        return aliases;
    }
}