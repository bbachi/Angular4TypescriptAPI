import { Action } from '@ngrx/store';

export const SAVE_LOGGED_IN_USER = '[Logged In User] Save User Info'
export const SAVE_LOGGED_IN_USER_HIERARCHY_DTLS = '[Logged In User] Save User Hierarchy Dtls'

export class SaveLoggedInUser implements Action {
    readonly type = SAVE_LOGGED_IN_USER;
    constructor(public payload:any) {}
}

export class SaveLoggedInUserHierarchyDetails implements Action {
    readonly type = SAVE_LOGGED_IN_USER_HIERARCHY_DTLS;
    constructor(public payload:any) {}
}

export type Actions =
   | SaveLoggedInUser
   | SaveLoggedInUserHierarchyDetails
