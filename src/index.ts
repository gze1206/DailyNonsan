import "reflect-metadata";
import { createConnection } from "typeorm";

import { WebServer } from './web';
import { SettingManager } from "./settingManager";
import { readFileSync } from "fs";

(async () => {

    createConnection().then(async connection => {

        const web = new WebServer(connection);

        SettingManager.SetupRoute(web, connection);
        web.use('/', (req, res, next) => {
            const settings = readFileSync('./views/settings.ejs', 'utf8');
            WebServer.Render(settings, ['settings.js'], req, res);
        });

        web.run(5252);
        console.log(await SettingManager.GetOption(connection, SettingManager.KEY_TRAINEE_NAME, true));
        console.log(await SettingManager.GetOption(connection, SettingManager.KEY_UNIT_NAME, true));

    }).catch(error => console.log(error));
})();
