import { Connection } from "typeorm";
import { Setting } from "./entity/Setting";
import { WebServer } from "./web";

export class SettingManager {

    static KEY_TRAINEE_NAME: string = "traineeName";
    static KEY_UNIT_NAME: string = "unitName";
    static KEY_ENTER_DATE: string = "enterDate";
    static KEY_BIRTH_DAY: string = "birthDay";

    static KEY_MAX_LINES: string = "maxLines";
    static KEY_MAX_CHARS: string = "maxChars";

    static KEY_LOGIN_ID: string = "loginID";
    static KEY_LOGIN_PW: string = "loginPW";

    static KEY_NEWS_API_KEY: string = "newsAPI_key";
    static KEY_MELON_URL: string = "melonURL";
    static KEY_MELON_LIMIT: string = "melonLIMIT";
    static KEY_EXCHANGE_URL: string = "exchangeURL";
    static KEY_EXCHANGE_CONF: string = "exchangeCONF";

    static DEFAULT_VALUES: { [key: string]: string } = {
        [SettingManager.KEY_TRAINEE_NAME]: 'TEST',
        [SettingManager.KEY_UNIT_NAME]: '23연대',
        [SettingManager.KEY_ENTER_DATE]: '20191128',
        [SettingManager.KEY_BIRTH_DAY]: '20191128',

        [SettingManager.KEY_MAX_LINES]: '25',
        [SettingManager.KEY_MAX_CHARS]: '1500',

        [SettingManager.KEY_LOGIN_ID]: 'id',
        [SettingManager.KEY_LOGIN_PW]: 'pw',

        [SettingManager.KEY_NEWS_API_KEY]: '',

        [SettingManager.KEY_MELON_URL]: 'https://www.melon.com/chart/day/index.htm',
        [SettingManager.KEY_MELON_LIMIT]: '20',

        [SettingManager.KEY_EXCHANGE_URL]: 'https://earthquake.kr:23490/query/',
        [SettingManager.KEY_EXCHANGE_CONF]: '{"USDKRW": {"name": "미국 달러", "val": 1}}',
    }

    public static async GetOption(conn: Connection, key: string, useDefault: boolean = false) {
        const repo = conn.getRepository(Setting);
        let data = await repo.findOne({ key: key });
        if (data == null || data.value == null) {
            if (!useDefault) {
                return null;
            }
            console.warn(`setting ${key} is empty! use default(${this.DEFAULT_VALUES[key]})`);
            data = await this.SetOption(conn, key, this.DEFAULT_VALUES[key]);
        }
        return data.value;
    }

    public static async SetOption(conn: Connection, key: string, value: string) {
        const repo = conn.getRepository(Setting);
        const data = new Setting();
        data.key = key;
        data.value = value;
        return await repo.save(data);
    }

    public static SetupRoute(server: WebServer, conn: Connection) {
        server.server.get('/settings', (req, res) => {
            Promise.all(Object.keys(SettingManager.DEFAULT_VALUES).map(key => this.GetOption(conn, key, true)))
                .then(result => {
                    console.log(`Loaded setting : ${result}`);
                    res.status(200).json({
                        [SettingManager.KEY_TRAINEE_NAME]: result[0],
                        [SettingManager.KEY_UNIT_NAME]: result[1],
                        [SettingManager.KEY_ENTER_DATE]: result[2],
                        [SettingManager.KEY_BIRTH_DAY]: result[3],
                        [SettingManager.KEY_MAX_LINES]: result[4],
                        [SettingManager.KEY_MAX_CHARS]: result[5],
                        [SettingManager.KEY_LOGIN_ID]: result[6],
                        [SettingManager.KEY_LOGIN_PW]: result[7],
                    });
                });
        });

        server.server.post('/settings', (req, res) => {
            const settings = req.body;
            Promise.all(Object.keys(settings).map(key => this.SetOption(conn, key, settings[key])))
                .then(result => {
                    console.log(`Saved setting : ${JSON.stringify(settings)}`);
                    res.status(200).send({ result: true, echo: req.body });
                });
        });
    }
}
