import { Action } from '@ngrx/store';

export const GET_CONTRACT_ACCOUNT_LIST = '[Billing] Get Contract Account List API'
export const GET_CONTRACT_ACCOUNT_LIST_SUCCESS = '[Billing] Get Contract Account List API Success'
export const GET_CONTRACT_ACCOUNT_LIST_FAILURE = '[Billing] Get Contract Account List API Failure'
export const GET_BILLING_INVOICE_LIST = '[Billing] Get Billing Invoice List API'
export const GET_BILLING_INVOICE_LIST_SUCCESS = '[Billing] Get Billing Invoice List API Success'
export const GET_BILLING_INVOICE_LIST_FAILURE = '[Billing] Get Billing Invoice List API Failure'

export class GetContractAccountList implements Action {
    readonly type = GET_CONTRACT_ACCOUNT_LIST;
    constructor(public payload:any) {}
}

export class GetContractAccountListSuccess implements Action {
    readonly type = GET_CONTRACT_ACCOUNT_LIST_SUCCESS;
    constructor(public payload:any) {}
}

export class GetContractAccountListFailure implements Action {
    readonly type = GET_CONTRACT_ACCOUNT_LIST_FAILURE;
    constructor(public payload:any) {}
}

export class GetBillingInvoiceList implements Action {
    readonly type = GET_BILLING_INVOICE_LIST;
    constructor(public payload:any) {}
}

export class GetBillingInvoiceListSuccess implements Action {
    readonly type = GET_BILLING_INVOICE_LIST_SUCCESS;
    constructor(public payload:any) {}
}

export class GetBillingInvoiceListFailure implements Action {
    readonly type = GET_BILLING_INVOICE_LIST_FAILURE;
    constructor(public payload:any) {}
}


export type Actions =
   | GetContractAccountList
   | GetContractAccountListSuccess
   | GetContractAccountListFailure
   | GetBillingInvoiceList
   | GetBillingInvoiceListSuccess
   | GetBillingInvoiceListFailure
