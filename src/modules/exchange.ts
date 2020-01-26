import ModuleBase from "./moduleBase";
import { Connection } from "typeorm";
import { SettingManager } from "../settingManager";
import Axios from "axios";

export default class ExchangeModule extends ModuleBase {
    private static NULL_CONTENT: string = '(Exchange load failed...)';
    private content?: string = undefined;

    public async DoWork(conn: Connection): Promise<ModuleBase> {
        this.content = undefined;

        const url = await SettingManager.GetOption(conn, SettingManager.KEY_EXCHANGE_URL, true);
        if (url == null) {
            console.error('EXCHANGE URL IS NULL!');
            return this;
        }
        const confJSON = await SettingManager.GetOption(conn, SettingManager.KEY_EXCHANGE_CONF, true);
        if (confJSON == null) {
            console.error('EXCHANGE CONF IS NULL!');
            return this;
        }
        const conf = JSON.parse(confJSON);
        const types = Object.keys(conf);

        const axios = Axios.create({
            baseURL: `${url}`,
            timeout: 1000,
        });
        if (axios == null) {
            console.error('EXCHANGE CLIENT INIT FAILED!');
            return this;
        }

        const res = await axios.get(`/${types.join(',')}`);
        if (res == null || res.data == null) {
            console.error('EXCHANGE REQUEST FAILED!');
            return this;
        }

        const arr: string[] = [];
        types.forEach(type => {
            const data = conf[type];
            const rate = parseFloat(res.data[type][0]);
            const val = parseFloat(data.val);

            arr.push(`${data.name} : ${rate * val}원`);
        });
        this.content = arr.join('\n');

        return this;
    }

    public GetText(): string {
        return this.content || ExchangeModule.NULL_CONTENT;
    }

    public GetLength(): number {
        return (this.content || ExchangeModule.NULL_CONTENT).length;
    }
}