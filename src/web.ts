import express from 'express';

export class WebServer {

    server: express.Express;

    constructor(port: number = 5252) {
        this.server = express();
        this.run(port);
    }

    public run(port: number) {
        const server = this.server;

        server.use('/', (req, res) => {
            res.status(200).json({
                test: 'hello',
            });
        });

        server.listen(port, () => {
            console.log('Run');
        });
    }
}
