import express from 'express';
import { ApplicationRequestHandler } from 'express-serve-static-core';

type handler = (req: express.Request, res: express.Response, next: express.NextFunction) => any;

export class WebServer {

    server: express.Express;

    constructor() {
        this.server = express();
    }

    public use(path: string, fn: handler) {
        this.server.use(path, fn);
    }

    public run(port: number) {
        this.server.listen(port, () => {
            console.log(`WEB : listen on ${port}...`);
        });
    }
}
