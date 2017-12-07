import * as loggedInUser from '../actions/loggedinuser';

export interface State {
    loggedInUser: any;
    customerList: any;
    hierarchyDetails: any
}

const initialState: State = {
    loggedInUser: {},
    customerList: [],
    hierarchyDetails: []
};

export function reducer(state= initialState, action: loggedInUser.Actions): State {

    switch(action.type) {

        case loggedInUser.SAVE_LOGGED_IN_USER: return {...state, loggedInUser: action.payload.user, customerList:action.payload.customerList};
        case loggedInUser.SAVE_LOGGED_IN_USER_HIERARCHY_DTLS: return {...state, hierarchyDetails: action.payload};

        default: return state
    }
}

export const getLoggedInUser = (state: State) => state.loggedInUser;
export const getLoggedInUserCustomerList = (state: State) => state.customerList;
export const getLoggedInUserHierarchyDtls = (state: State) => state.hierarchyDetails;
export const getLoggedInUserSecurityRole = (state: State) => state.loggedInUser.webSecurityRole
export const getLoggedInUserSecurityRoleDisplayName = (state: State) => state.loggedInUser.securityRoleDisplayName
