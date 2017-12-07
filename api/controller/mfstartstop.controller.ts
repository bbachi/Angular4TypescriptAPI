import {Router, Request, Response, NextFunction} from 'express';
import LoggerUtil from '../logs/log';
import { MFStartStopHelper } from './../helper/mfstartstop.helper';


export class MFStartStopController {


  public getGMEForms(req: Request, res: Response, next: NextFunction) {

      let mfStartStopHelper = new MFStartStopHelper();
      mfStartStopHelper.getServiceAddressForMF(req.body.serviceType, req).then(s => {
        res.json(s)
      })

  }



}
