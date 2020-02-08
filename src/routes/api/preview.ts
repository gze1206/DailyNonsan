import { WebServer } from "../../web";
import ModuleBase from "../../modules/moduleBase";
import NewsModule from "../../modules/news";
import MelonModule from "../../modules/melon";
import ExchangeModule from "../../modules/exchange";
import LetterManager from "../../letterManager";
import { Connection } from "typeorm";

export default function PreviewRoute(web: WebServer, connection: Connection) {
    web.get('/api/preview/news', async (req, res, next) => {
        const module: ModuleBase = (await new NewsModule().DoWork(connection));
        res.status(200).send(module.GetText());
    });
    web.get('/api/preview/melon', async (req, res, next) => {
        const module: ModuleBase = (await new MelonModule().DoWork(connection));
        res.status(200).send(module.GetText());
    });
    web.get('/api/preview/exchange', async (req, res, next) => {
        const module: ModuleBase = (await new ExchangeModule().DoWork(connection));
        res.status(200).send(module.GetText());
    });
    web.get('/api/preview/letter1', async (req, res, next) => {
        const mng = new LetterManager(connection);
        await mng.SetTitle('뉴스 모음');
        await mng.ContentFromModule(new NewsModule());

        const msg = await mng.GetMessage();
        res.status(200).send(`${msg.getSympathyLetterSubject()}\n\n${msg.getSympathyLetterContent()}`);
    });
    web.get('/api/preview/letter2', async (req, res, next) => {
        const mng = new LetterManager(connection);
        await mng.SetTitle('멜론 차트 & 환율 정보');
        await mng.ContentFromModule(new MelonModule());
        await mng.AddContent('');
        await mng.ContentFromModule(new ExchangeModule());

        const msg = await mng.GetMessage();
        res.status(200).send(`${msg.getSympathyLetterSubject()}\n\n${msg.getSympathyLetterContent()}`);
    });
} 