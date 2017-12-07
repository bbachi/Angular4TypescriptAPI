import * as Express from 'express';

export interface Request extends Express.Request {
    session: any;
}

export class BaseRequest {
    
    constructor(){
    }
    
    strCompanyCode: string;
    strLoggedInUserName: string;
    strPortal: string;
}