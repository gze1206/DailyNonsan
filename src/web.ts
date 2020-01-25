import express from 'express';
import { Connection } from 'typeorm';
import { readFileSync } from 'fs';
import { render } from 'ejs';
import * as bodyParser from 'body-parser';

type handler = (req: express.Request, res: express.Response, next: express.NextFunction) => any;

class NavbarItem {
    href: string;
    text: string;

    constructor(href: string = '/', text: string = 'AAA') {
        this.href = href;
        this.text = text;
    }
}

export class WebServer {

    server: express.Express;
    dbConn: Connection;
    static title = 'Daily NonSan';
    static navbar: NavbarItem[] = [
        new NavbarItem('/', 'MAIN'),
        new NavbarItem('/preview', 'PREVIEW'),
    ];

    constructor(conn: Connection) {
        const server = this.server = express();
        server.set('views', __dirname + '/../views');
        server.set('view engine', 'ejs');
        server.use(express.static('./public'));
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: true }));

        this.dbConn = conn;
    }

    public use(path: string, fn: handler) {
        this.server.use(path, fn);
    }
    public get(path: string, fn: handler) {
        this.server.get(path, fn);
    }
    public post(path: string, fn: handler) {
        this.server.post(path, fn);
    }
    public delete(path: string, fn: handler) {
        this.server.delete(path, fn);
    }

    public run(port: number) {
        this.server.listen(port, () => {
            console.log(`WEB : listen on ${port}...`);
        });
    }

    public static Render(content: string, scripts: string[], req: express.Request, res: express.Response) {
        const common = readFileSync('./views/common.ejs', 'utf8');
        const data = render(common, {
            title: WebServer.title,
            content: content,
            navbar: WebServer.navbar,
            scripts: scripts,
        });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    }
}
