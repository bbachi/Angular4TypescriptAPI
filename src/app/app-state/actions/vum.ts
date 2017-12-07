import { Action } from '@ngrx/store';

export const GET_VACANT_DAILY_REPORT = '[VUM] Vacant Daily Report API'
export const GET_VACANT_DAILY_REPORT_SUCCESS = '[VUM] Vacant Daily Report API Success'
export const GET_VACANT_DAILY_REPORT_FAILURE = '[VUM] Vacant Daily Report API Failure'

export class GetVacantDailyReport implements Action {
    readonly type = GET_VACANT_DAILY_REPORT;
    constructor(public payload:any) {}
}

export class GetVacantDailyReportSuccess implements Action {
    readonly type = GET_VACANT_DAILY_REPORT_SUCCESS;
    constructor(public payload:any) {}
}

export class GetVacantDailyReportFailure implements Action {
    readonly type = GET_VACANT_DAILY_REPORT_FAILURE;
    constructor(public payload:any) {}
}


export type Actions =
   | GetVacantDailyReport
   | GetVacantDailyReportSuccess
   | GetVacantDailyReportFailure
