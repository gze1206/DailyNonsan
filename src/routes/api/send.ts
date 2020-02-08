import { WebServer } from "../../web";
import { Connection } from "typeorm";
import ModuleBase from "../../modules/moduleBase";
import NewsModule from "../../modules/news";
import MelonModule from "../../modules/melon";
import ExchangeModule from "../../modules/exchange";
import LetterManager from "../../letterManager";
import NewLineModule from "../../modules/newLine";

class Page {
    public title: string = '';
    public modules: ModuleBase[] = [];
}

const pages: { [key: string]: Page } = {
    page1: {
        title: '뉴스 모음',
        modules: [new NewsModule()],
    },
    page2: {
        title: '멜론 차트 & 환율 정보',
        modules: [new MelonModule(), new NewLineModule(), new ExchangeModule()],
    },
};
const allPages: Page[] = ([] as Page[]).concat(Object.values(pages));

function send(connection: Connection, ...pages: Page[]) {
    pages.forEach(async page => {
        const mng = new LetterManager(connection);
        await mng.SetTitle(page.title);
        for (const iter of page.modules) {
            await mng.ContentFromModule(iter);
        }

        await mng.SendMessage();
        console.log(`SEND DONE! ${page.title}`);
    });

}

export default function SendRoute(web: WebServer, connection: Connection) {
    web.post('/api/send/:type', (req, res, next) => {
        const type = req.params.type;
        let page = pages[type];
        console.log(type, page);

        if ('all' === type) {
            send(connection, ...allPages);
        } else if (page) {
            send(connection, page);
        } else {
            console.error('PAGE IS NULL!');
            res.status(403).send('PAGE IS NULL');
            return;
        }

        res.status(200).send();
    });
}