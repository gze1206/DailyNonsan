import { fetch } from 'cheerio-httpcli';
import ModuleBase from './moduleBase';
import { Connection } from 'typeorm';
import { SettingManager } from '../settingManager';

export default class MelonModule extends ModuleBase {
    private static NULL_CONTENT: string = '(Melon load failed...)';
    private content?: string = undefined;

    public async DoWork(conn: Connection): Promise<ModuleBase> {
        this.content = undefined;

        const url = await SettingManager.GetOption(conn, SettingManager.KEY_MELON_URL, true);
        if (url == null) {
            console.error('MELON URL IS NULL!');
            return this;
        }
        const limitStr = await SettingManager.GetOption(conn, SettingManager.KEY_MELON_LIMIT, true);
        if (limitStr == null) {
            console.error('MELON LIMIT IS NULL!');
            return this;
        }
        const limit = parseInt(limitStr);

        const res = await fetch(url);
        if (res == null) {
            console.error('MELON RESPONSE IS NULL!');
            return this;
        }

        const arr: string[] = [];
        res.$('.lst50').slice(0, limit).each((_, elem) => {
            const rank = res.$(elem).first().find('td:nth-child(2) > div > span.rank').first().text();
            const rankChanged = res.$(elem).find('.rank_wrap').attr('title');
            const title = res.$(elem).find('.ellipsis.rank01 a').first().text();
            const artist = res.$(elem).find('.ellipsis.rank02 a').first().text();
            arr.push(`${rank} (${rankChanged}) : ${title} - ${artist}`);
        });
        this.content = arr.join('\n');

        return this;
    }

    public GetText(): string {
        return this.content || MelonModule.NULL_CONTENT;
    }

    public GetLength(): number {
        return (this.content || MelonModule.NULL_CONTENT).length;
    }
}