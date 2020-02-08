import "reflect-metadata";
import { CronJob } from "cron";
import { createConnection } from "typeorm";

import { WebServer } from './web';
import { SettingManager } from "./settingManager";
import PreviewRoute from "./routes/api/preview";
import SendRoute from "./routes/api/send";
import PageRoute from "./routes/pages";
import Axios from "axios";

const port: number = 5252;

(async () => {

    createConnection().then(async connection => {

        const web = new WebServer(connection);

        SettingManager.SetupRoute(web, connection);

        SetupCron();
        web.use('/cron', function (req, res, next) {
            if (JOB_sendAll) {
                JOB_sendAll.fireOnTick();
            }
            res.status(200).send('DONE');
        });

        PreviewRoute(web, connection);
        SendRoute(web, connection);
        PageRoute(web, connection);

        web.run(port);
        console.log(await SettingManager.GetOption(connection, SettingManager.KEY_TRAINEE_NAME, true));
        console.log(await SettingManager.GetOption(connection, SettingManager.KEY_UNIT_NAME, true));

        // const module: ModuleBase = new NewsModule();
        // console.log(`length : ${(await module.DoWork(connection)).GetLength()}`);

    }).catch(error => console.log(error));
})();

let JOB_sendAll: CronJob | null = null;
function SetupCron() {
    JOB_sendAll = new CronJob('0 5 * * *', async () => {
        const axios = Axios.create({
            baseURL: `http://127.0.0.1:${port}/api/send`,
            timeout: 1000,
        });
        if (axios == null) {
            console.error('[CRON] CLIENT INIT FAILED!');
            return;
        }

        await axios.post('all');
        console.log(`${new Date().toISOString()} - Cron worked!`);
    });

    JOB_sendAll.start();
}
