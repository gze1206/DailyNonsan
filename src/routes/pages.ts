import { WebServer } from "../web";
import { Connection } from "typeorm";
import { readFileSync } from "fs";

export default function PageRoute(web: WebServer, connection: Connection) {
    web.use('/tjfwjdvpdlwl', (req, res, next) => {
        const settings = readFileSync('./views/settings.ejs', 'utf8');
        WebServer.Render(settings, ['settings.js'], req, res);
    });
    web.use('/preview', async (req, res, next) => {
        const preview = readFileSync('./views/preview.ejs', 'utf8');
        WebServer.Render(preview, ['preview.js'], req, res);
    });
    web.use('/', (req, res, next) => {
        const index = readFileSync('./views/index.ejs', 'utf8');
        WebServer.Render(index, ['index.js'], req, res);
    });
}