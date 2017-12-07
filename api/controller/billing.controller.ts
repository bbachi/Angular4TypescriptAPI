import {Router, Request, Response, NextFunction} from 'express';
import LoggerUtil from '../logs/log';
import { BillingHelper } from './../helper/billing.helper';

export class BillingController {


  public getPreviousBills(req: Request, res: Response, next: NextFunction) {

      let billingHelper = new BillingHelper();
      billingHelper.getPreviousBills(req).then(s => {
        res.json(s)
      })
  }

  public getPaymentHistory(req: Request, res: Response, next: NextFunction) {

      let billingHelper = new BillingHelper();
      billingHelper.getPaymentHistory(req).then(s => {
        res.json(s)
      })
  }

  public modifyPayment(req: Request, res: Response, next: NextFunction) {

      let billingHelper = new BillingHelper();
      billingHelper.modifyPayment(req).then(s => {
        res.json(s)
      })
  }

  public cancelPayment(req: Request, res: Response, next: NextFunction) {

      let billingHelper = new BillingHelper();
      billingHelper.cancelPayment(req).then(s => {
        res.json(s)
      })
  }

  public getContractAccountList(req: Request, res: Response, next: NextFunction){

      let billingHelper = new BillingHelper();
      billingHelper.getContractAccountList(req).then(s => {
        res.json(s)
      })
  }

  public getBillingDetails(req: Request, res: Response, next: NextFunction) {

      let billingHelper = new BillingHelper();
      billingHelper.getBillingDetails(req).then(s => {
        res.json(s)
      })

  }

  public submitPayment(req: Request, res: Response, next: NextFunction) {

      let billingHelper = new BillingHelper();
      billingHelper.submitPayment(req).then(s => {
        res.json(s)
      })
  }

  public getStoredBankDtls(req: Request, res: Response, next: NextFunction) {

      let billingHelper = new BillingHelper();
      billingHelper.getStoredBankDtls(req).then(s => {
        res.json(s)
      })
  }


}
