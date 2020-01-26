import ModuleBase from "./moduleBase";
import Axios from "axios";
import { SettingManager } from "../settingManager";
import { Connection } from "typeorm";

export default class NewsModule extends ModuleBase {
    private static NULL_CONTENT: string = '(News load failed...)';
    private content?: string = undefined;

    public async DoWork(conn: Connection): Promise<ModuleBase> {
        this.content = undefined;

        const key = await SettingManager.GetOption(conn, SettingManager.KEY_NEWS_API_KEY, true);
        if (key == null) {
            console.error('NEWS API KEY IS NULL!');
            return this;
        }

        const axios = Axios.create({
            baseURL: 'https://newsapi.org/v2/',
            timeout: 1000,
            headers: {
                'X-Api-Key': key,
            }
        });
        if (axios == null) {
            console.error('NEWS API CLIENT INIT FAILED!');
            return this;
        }

        const res = await axios.get('/top-headlines', {
            params: {
                country: 'kr',
            }
        });
        if (res == null || res.data == null) {
            console.error('NEWS API REQUEST FAILED!');
            return this;
        }
        if (res.data.status !== 'ok') {
            console.error(`NEWS API REQUEST WRONG RESPONSE! ${res.data.status}`);
            return this;
        }

        console.log(`NEWS API RESPONSE : ${res.status}`);
        const articles = res.data.articles;
        if (articles == null) {
            console.error('NEWS API ARTICLES IS EMPTY!');
            return this;
        }

        const txt = articles.map((iter: any, idx: number) => {
            if (iter == null || iter.title == null) {
                return `${idx + 1}. ${NewsModule.NULL_CONTENT}`;
            }
            return `${idx + 1}. ${iter.title}`;
        }).join('\n');
        // console.log(`NEWS API RESULT : ${txt}`);

        if (txt.length > 0) {
            this.content = txt;
        }

        return this;
    }

    public GetText(): string {
        return this.content || NewsModule.NULL_CONTENT;
    }

    public GetLength(): number {
        return (this.content || NewsModule.NULL_CONTENT).length;
    }
}