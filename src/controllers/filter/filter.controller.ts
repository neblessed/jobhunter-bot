import * as fs from "fs";
import {UserFilterType} from "./types/filter.type";

export class FilterController {
    private path = 'src/storage/user-filters.json';
    userFilter: UserFilterType = {
        user_id: 1,
        position: '1',
        grade: '1',
        salary: '123',
        type: '1',
        lang: '123',
        location: '1'
    };

    readStorage() {
        const data = fs.readFileSync(this.path, 'utf8');

        if (!data) {
            throw new Error(`Error while parse storage (${this.path})`);
        } else {
            return JSON.parse(data) as UserFilterType[];
        }
    }

    getUserFilter(userId: number) {
        const filters = this.readStorage();

        return filters.find(f => f.user_id === userId);
    }

    addKeyInFilter<K extends keyof UserFilterType, V extends typeof this.userFilter[K]>(key: K, value: V) {
        this.userFilter[key] = value;
    }
}