import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';
import { of } from 'rxjs/observable/of';
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BillingService } from '../../_services/billing.service';
import * as paymenthistory from '../actions/paymenthistory';
import * as previousbills from '../actions/previousbills';
import * as billing from '../actions/billing';

@Injectable()
export class BillingEffects {

  constructor(private action$: Actions, private billingService: BillingService) { }

  @Effect()
  getPaymentHistoryEffects$ = this.action$.ofType(paymenthistory.GET_PAYMENT_HISTORY)
    .map(toPayload)
    .switchMap((payload) => this.billingService.getPaymentHistory(payload)
    .map((dailyReport) => {
        return new paymenthistory.GetPaymentHistorySuccess(dailyReport)
    }))
    .catch(() => Observable.of(new paymenthistory.GetPaymentHistoryFailure({})))


  @Effect()
  getPreviousBillsEffects$ = this.action$.ofType(previousbills.GET_PREVIOUS_BILLS)
    .map(toPayload)
    .switchMap((payload) => this.billingService.getPreviousBills(payload)
    .map((dailyReport) => {
        return new previousbills.GetPreviousBillsSuccess(dailyReport)
    }))
    .catch(() => Observable.of(new previousbills.GetPreviousBillsFailure({})))


  @Effect()
  getContractAccountListEffects$ = this.action$.ofType(billing.GET_CONTRACT_ACCOUNT_LIST)
    .map(toPayload)
    .switchMap((payload) => this.billingService.getContractAccountList(payload)
    .map((response) => {
        return new billing.GetContractAccountListSuccess(response)
    }))
    .catch(() => Observable.of(new billing.GetContractAccountListFailure({})))


  @Effect()
  getBillingInvoiceListEffects$ = this.action$.ofType(billing.GET_BILLING_INVOICE_LIST)
    .map(toPayload)
    .switchMap((payload) => this.billingService.getBillingInvoiceList(payload)
    .map((response) => {
        return new billing.GetBillingInvoiceListSuccess(response)
    }))
    .catch(() => Observable.of(new billing.GetBillingInvoiceListFailure({})))


}
