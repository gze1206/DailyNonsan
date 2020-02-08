import * as thecamp from 'the-camp-lib';
import { Connection } from 'typeorm';
import { SettingManager } from "./settingManager";
import ModuleBase from './modules/moduleBase';

export default class LetterManager {
    private cookies?: thecamp.Cookie = undefined;

    private title: string = '';
    private contents: string[] = [];

    private conn: Connection;

    public constructor(conn: Connection) {
        this.conn = conn;
    }

    public async GetMaxLines() {
        const str = await SettingManager.GetOption(this.conn, SettingManager.KEY_MAX_LINES, true);
        if (str == null) {
            return -1;
        }
        const ret = parseInt(str);
        return ret;
    }

    public async GetMaxChars() {
        const str = await SettingManager.GetOption(this.conn, SettingManager.KEY_MAX_CHARS, true);
        if (str == null) {
            return -1;
        }
        const ret = parseInt(str);
        return ret;
    }

    public Reset() {
        this.cookies = undefined;
        this.title = '';
        this.contents = [];

        return this;
    }

    private getUnitName(unitName: string): thecamp.SoldierUnitName {
        switch (unitName) {
            case '23연대':
                return '육군훈련소(23연대)';
            case '25연대':
                return '육군훈련소(25연대)';
            case '26연대':
                return '육군훈련소(26연대)';
            case '27연대':
                return '육군훈련소(27연대)';
            case '28연대':
                return '육군훈련소(28연대)';
            case '29연대':
                return '육군훈련소(29연대)';
            case '30연대':
                return '육군훈련소(30연대)';
        }
        return '육군훈련소';
    }

    private async MakeTrainee() {
        const conn = this.conn;

        const id = await SettingManager.GetOption(conn, SettingManager.KEY_LOGIN_ID, true) || '';
        const pw = await SettingManager.GetOption(conn, SettingManager.KEY_LOGIN_PW, true) || '';

        const traineeName = await SettingManager.GetOption(conn, SettingManager.KEY_TRAINEE_NAME, true) || '';
        const birthDate = await SettingManager.GetOption(conn, SettingManager.KEY_BIRTH_DAY, true) || '';

        const unitName = await SettingManager.GetOption(conn, SettingManager.KEY_UNIT_NAME, true) || '';
        const enterDate = await SettingManager.GetOption(conn, SettingManager.KEY_ENTER_DATE, true) || '';


        // const soldier = new thecamp.Soldier(
        //     traineeName,
        //     birthDate,
        //     enterDate,
        //     '예비군인/훈련병',
        //     '육군',
        //     this.getUnitName(unitName),
        //     thecamp.SoldierRelationship.FRIEND
        // );
        const soldier = new thecamp.Soldier(
            '심은보',
            '19990904',
            '20200128',
            '예비군인/훈련병',
            '육군',
            '육군훈련소',
            thecamp.SoldierRelationship.FRIEND
        );
        // console.log(soldier);

        // console.log(id, pw);
        const cookies = await thecamp.login(id, pw);
        this.cookies = cookies;

        const result = await thecamp.addSoldier(cookies, soldier);
        // console.log(cookies, result);
        const [trainee] = await thecamp.fetchSoldiers(cookies, soldier);
        // console.log(cookies, trainee);

        return trainee;
    }

    public SetTitle(title: string) {
        this.title = title;
        return this;
    }

    public async ContentFromModule(mod: ModuleBase) {
        return this.AddContent(
            (await mod.DoWork(this.conn))
                .GetText()
        );
    }

    public AddContent(content: string) {
        this.contents.push(content);
        return this;
    }

    public FormatTitle() {
        const now = new Date();
        const yyyy = now.getFullYear().toString();
        const mm = (now.getMonth() + 1).toString().padStart(2, '0');
        const dd = now.getDate().toString().padStart(2, '0');

        return `${yyyy}-${mm}-${dd} : ${this.title}`;
    }

    private bakeMessage(traineeID?: string) {
        let body = this.contents.join('\n');
        if (null != traineeID) {
            body = body.replace(/\n/gi, '<br/>');
        }
        const message = new thecamp.Message(
            this.FormatTitle(),
            body,
            traineeID || ''
        );
        return message;
    }

    public async GetMessage() {
        // const trainee = await this.MakeTrainee();
        const message = this.bakeMessage();
        return message;
    }

    public async SendMessage() {
        const trainee = await this.MakeTrainee();
        if (this.cookies == null) {
            return this;
        }

        const message = this.bakeMessage(trainee.getTraineeMgrSeq());
        await thecamp.sendMessage(this.cookies, trainee, message);

        return this;
    }
};
