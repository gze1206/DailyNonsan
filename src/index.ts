import "reflect-metadata";
import { createConnection } from "typeorm";

import { WebServer } from './web';
import { SettingManager } from "./settingManager";

(async () => {

    createConnection().then(async connection => {

        const web = new WebServer(connection);
        web.use('/', (req, res) => {
            res.status(200).json({
                test: 'HELLO!',
            });
        });
        web.run(5252);
        console.log(await SettingManager.GetOption(connection, SettingManager.KEY_TRAINEE_NAME, true));
        console.log(await SettingManager.GetOption(connection, SettingManager.KEY_UNIT_NAME, true));

    }).catch(error => console.log(error));
})();
