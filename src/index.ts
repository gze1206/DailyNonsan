import "reflect-metadata";
import { createConnection } from "typeorm";

import { WebServer } from './web';
import { SettingManager } from "./settingManager";
import { readFileSync } from "fs";
import NewsModule from "./modules/news";
import ModuleBase from "./modules/moduleBase";
import MelonModule from "./modules/melon";
import ExchangeModule from "./modules/exchange";

(async () => {

    createConnection().then(async connection => {

        const web = new WebServer(connection);

        SettingManager.SetupRoute(web, connection);
        web.use('/tjfwjdvpdlwl', (req, res, next) => {
            const settings = readFileSync('./views/settings.ejs', 'utf8');
            WebServer.Render(settings, ['settings.js'], req, res);
        });
        web.use('/preview', async (req, res, next) => {
            const preview = readFileSync('./views/preview.ejs', 'utf8');
            WebServer.Render(preview, ['preview.js'], req, res);
        });

        web.use('/api/preview/news', async (req, res, next) => {
            const module: ModuleBase = (await new NewsModule().DoWork(connection));
            res.status(200).send(module.GetText());
        });
        web.use('/api/preview/melon', async (req, res, next) => {
            const module: ModuleBase = (await new MelonModule().DoWork(connection));
            res.status(200).send(module.GetText());
        });
        web.use('/api/preview/exchange', async (req, res, next) => {
            const module: ModuleBase = (await new ExchangeModule().DoWork(connection));
            res.status(200).send(module.GetText());
        });

        web.run(5252);
        console.log(await SettingManager.GetOption(connection, SettingManager.KEY_TRAINEE_NAME, true));
        console.log(await SettingManager.GetOption(connection, SettingManager.KEY_UNIT_NAME, true));

        // const module: ModuleBase = new NewsModule();
        // console.log(`length : ${(await module.DoWork(connection)).GetLength()}`);

    }).catch(error => console.log(error));
})();
