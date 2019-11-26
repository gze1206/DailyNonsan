import { Connection } from "typeorm";
import { Setting } from "./entity/Setting";

export class SettingManager {

    static KEY_TRAINEE_NAME: string = "traineeName";
    static KEY_UNIT_NAME: string = "unitName";
    static KEY_ENTER_DATE: string = "enterDate";
    static KEY_BIRTH_DAY: string = "birthDay";

    static DEFAULT_VALUES: { [key: string]: string } = {
        [SettingManager.KEY_TRAINEE_NAME]: 'TEST',
        [SettingManager.KEY_UNIT_NAME]: '23연대',
        [SettingManager.KEY_ENTER_DATE]: '20191128',
        [SettingManager.KEY_BIRTH_DAY]: '20191128',
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
}