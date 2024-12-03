import {IConfigService} from "./config.interface";
import {config, DotenvParseOutput} from 'dotenv'

export class ConfigService implements IConfigService{
    private readonly config: DotenvParseOutput;
    constructor() {
        const {error, parsed} = config();

        if(error){
            throw new Error('.env not found')
        }

        if(!parsed){
            throw new Error('unknown env')
        }

        this.config = parsed;
    }
    get(key: string): string {
        const res = this.config[key];

        if(!res){
            throw new Error('token key not found')
        }

        return res;
    }

}