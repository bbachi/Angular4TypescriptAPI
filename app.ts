import * as express from 'express';
import * as expressSession from 'express-session';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { GMESSRouter } from './api/router/gmess.router';
import { GMESSInterceptor } from './api/interceptor/gmess.interceptor';
import fileUpload = require('express-fileupload');

class App {

    public express: express.Application;
    public gmessRouter: GMESSRouter = new GMESSRouter();
    public gmessInterceptor: GMESSInterceptor = new GMESSInterceptor();

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.gmessRouter.init();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(expressSession({
                    name: 'server-session-cookie-id',
                    secret: 'secrettoken',
                    resave: true,
                    saveUninitialized: true,
                    rolling: true,
                    cookie: {
                    path: "/",
                    }
        }));
        this.express.use(fileUpload({debug: true}));
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(this.gmessInterceptor.beforeEachRequest);
        this.express.use(express.static("./dist"));
        this.express.use('/gmeSSApp', express.static(process.cwd()+"/GMESSAPP/dist/"));
    }

    private routes(): void {
        /* This is just to get up and running, and to make sure what we've got is
        * working so far. This function will change when we start to add more
        * API endpoints */
        let gmeSSAPIRouter = express.Router();
        // placeholder route handler
        gmeSSAPIRouter.get('/*', (req, res, next) => {
            res.sendFile(process.cwd()+"/GMESSAPP/dist/index.html");
        });
        this.express.use('/gmeSSApp', gmeSSAPIRouter);
        this.express.use('/portalAPI', this.gmessRouter.router);
    }
}

export default new App().express;
