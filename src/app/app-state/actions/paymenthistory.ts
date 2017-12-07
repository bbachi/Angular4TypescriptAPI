import { Action } from '@ngrx/store';

export const GET_PAYMENT_HISTORY = '[Billing] Payment History API'
export const GET_PAYMENT_HISTORY_SUCCESS = '[Billing] Payment History API Success'
export const GET_PAYMENT_HISTORY_FAILURE = '[Billing] Payment History API Failure'

export class GetPaymentHistory implements Action {
    readonly type = GET_PAYMENT_HISTORY;
    constructor(public payload:any) {}
}

export class GetPaymentHistorySuccess implements Action {
    readonly type = GET_PAYMENT_HISTORY_SUCCESS;
    constructor(public payload:any) {}
}

export class GetPaymentHistoryFailure implements Action {
    readonly type = GET_PAYMENT_HISTORY_FAILURE;
    constructor(public payload:any) {}
}


export type Actions =
   | GetPaymentHistory
   | GetPaymentHistorySuccess
   | GetPaymentHistoryFailure
