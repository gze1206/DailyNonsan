import { WebServer } from './web';

(async () => {

    const web = new WebServer();
    web.use('/', (req, res) => {
        res.status(200).json({
            test: 'HELLO!',
        });
    });
    web.run(5252);

})();
