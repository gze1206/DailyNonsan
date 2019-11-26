import express from 'express';
import { Connection } from 'typeorm';
import { readFileSync } from 'fs';
import { render } from 'ejs';

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
        new NavbarItem('/', '뭐 넣지'),
        new NavbarItem('/', '뭐 넣을까'),
    ];

    constructor(conn: Connection) {
        const server = this.server = express();
        server.set('views', __dirname + '/../views');
        server.set('view engine', 'ejs');

        this.dbConn = conn;
    }

    public use(path: string, fn: handler) {
        this.server.use(path, fn);
    }

    public run(port: number) {
        this.server.listen(port, () => {
            console.log(`WEB : listen on ${port}...`);
        });
    }

    public static Render(content: string, req: express.Request, res: express.Response) {
        const header = readFileSync('./views/index.ejs', 'utf8');
        const data = render(header, {
            title: WebServer.title,
            content: content,
            navbar: WebServer.navbar,
        });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    }
}
