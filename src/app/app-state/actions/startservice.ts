import { Action } from '@ngrx/store';

export const LIST_PROPERTY_ADDRESS = '[StartService] List Property Addresses From API'
export const LIST_PROPERTY_ADDRESS_SUCCESS = '[StartService] List Property Addresses From API Success'
export const LIST_PROPERTY_ADDRESS_FAILURE = '[StartService] List Property Addresses From API Failure'
export const SAVE_SELECTED_PROPERTY = '[StartService] Save Selected Property'
export const SAVE_SELECTED_UNITS = '[StartService] Save Selected Units'
export const SUBMIT_START_SERVICE = '[StartService] Submit API'
export const SUBMIT_START_SERVICE_SUCCESS = '[StartService] Submit API Success'
export const SUBMIT_START_SERVICE_FAILURE = '[StartService] Submit API Failure'
export const SUBMIT_STOP_SERVICE = '[StopService] Submit API'
export const SUBMIT_STOP_SERVICE_SUCCESS = '[StopService] Submit API Success'
export const SUBMIT_STOP_SERVICE_FAILURE = '[StopService] Submit API Failure'
export const SAVE_PLAN_DETAILS = '[StartService] Save Plan Details'
export const GET_PLAN_DETAILS = '[StartService] Get Plan Details'

export class ListPropertyAddresses implements Action {
    readonly type = LIST_PROPERTY_ADDRESS;
    constructor(public payload:any) {}
}

export class ListPropertyAddressesSuccess implements Action {
    readonly type = LIST_PROPERTY_ADDRESS_SUCCESS;
    constructor(public payload:any) {}
}

export class ListPropertyAddressesFailure implements Action {
    readonly type = LIST_PROPERTY_ADDRESS_FAILURE;
    constructor(public payload:any) {}
}

export class SaveSelectedProperty implements Action {
    readonly type = SAVE_SELECTED_PROPERTY;
    constructor(public payload:any) {}
}

export class SaveSelectedUnits implements Action {
    readonly type = SAVE_SELECTED_UNITS;
    constructor(public payload:any) {}
}

export class SubmitStartService implements Action {
    readonly type = SUBMIT_START_SERVICE;
    constructor(public payload:any) {}
}

export class SubmitStartServiceSuccess implements Action {
    readonly type = SUBMIT_START_SERVICE_SUCCESS;
    constructor(public payload:any) {}
}

export class SubmitStartServiceFailure implements Action {
    readonly type = SUBMIT_START_SERVICE_FAILURE;
    constructor(public payload:any) {}
}

export class SubmitStopService implements Action {
    readonly type = SUBMIT_STOP_SERVICE;
    constructor(public payload:any) {}
}

export class SubmitStopServiceSuccess implements Action {
    readonly type = SUBMIT_STOP_SERVICE_SUCCESS;
    constructor(public payload:any) {}
}

export class SubmitStopServiceFailure implements Action {
    readonly type = SUBMIT_STOP_SERVICE_FAILURE;
    constructor(public payload:any) {}
}

export class SavePlanDetails implements Action {
    readonly type = SAVE_PLAN_DETAILS;
    constructor(public payload:any) {}
}

export class GetPlanDetails implements Action {
    readonly type = GET_PLAN_DETAILS;
    constructor(public payload:any) {}
}


export type Actions =
   | ListPropertyAddresses
   | ListPropertyAddressesSuccess
   | ListPropertyAddressesFailure
   | SaveSelectedProperty
   | SaveSelectedUnits
   | SubmitStartService
   | SubmitStartServiceSuccess
   | SubmitStartServiceFailure
   | SubmitStopService
   | SubmitStopServiceSuccess
   | SubmitStopServiceFailure
   | GetPlanDetails
   | SavePlanDetails
