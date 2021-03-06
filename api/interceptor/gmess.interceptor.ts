import {Request, Response, NextFunction} from 'express';
import LoggerUtil from './../logs/log';

export class GMESSInterceptor {

    public beforeEachRequest(req: Request, res: Response, next: NextFunction){

        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        LoggerUtil.info('GMESSInterceptor::request URL:::'+fullUrl+":::::with body::::"+JSON.stringify(req.body));
        LoggerUtil.info('SESSION ID:::'+req.sessionID);
        next();
    }

}
