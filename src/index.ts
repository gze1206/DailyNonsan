import "reflect-metadata";
import { createConnection } from "typeorm";

import { WebServer } from './web';
import { SettingManager } from "./settingManager";
import { readFileSync } from "fs";
import NewsModule from "./modules/news";
import ModuleBase from "./modules/moduleBase";
import MelonModule from "./modules/melon";
import ExchangeModule from "./modules/exchange";
import LetterManager from "./letterManager";
import PreviewRoute from "./routes/api/preview";
import SendRoute from "./routes/api/send";
import PageRoute from "./routes/pages";

(async () => {

    createConnection().then(async connection => {

        const web = new WebServer(connection);

        SettingManager.SetupRoute(web, connection);

        PreviewRoute(web, connection);
        SendRoute(web, connection);
        PageRoute(web, connection);

        web.run(5252);
        console.log(await SettingManager.GetOption(connection, SettingManager.KEY_TRAINEE_NAME, true));
        console.log(await SettingManager.GetOption(connection, SettingManager.KEY_UNIT_NAME, true));

        // const module: ModuleBase = new NewsModule();
        // console.log(`length : ${(await module.DoWork(connection)).GetLength()}`);

    }).catch(error => console.log(error));
})();
