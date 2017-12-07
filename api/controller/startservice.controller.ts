import {Router, Request, Response, NextFunction} from 'express';
import LoggerUtil from '../logs/log';
import { StartServiceHelper } from '../helper/startservice.helper';

export class StartServiceController {


  public listPropertyAddress(req: Request, res: Response, next: NextFunction) {

      let startHelper = new StartServiceHelper();
      startHelper.listPropertyAddress(req).then(s => {
        res.json(s)
      })
  }

  public startServiceSubmit(req: Request, res: Response, next: NextFunction) {

      let startHelper = new StartServiceHelper();
      startHelper.startServiceSubmit(req).then((s:any) => {
        res.json(s)
      })
  }

  public getpromoCodeDetails(req: Request, res: Response, next: NextFunction) {

      let startHelper = new StartServiceHelper();
      startHelper.getPromocodeList(req).then((s:any) => {
          res.json(s)
      })
  }

}
