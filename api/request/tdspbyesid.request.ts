import { BaseRequest } from './base.request';
import * as cst from './../util/constant';

export class TdspByESIDRequest extends BaseRequest {
    
        constructor(){
            super();
        }
       companyCode:string;
       pointOfDeliveryId:string;
}