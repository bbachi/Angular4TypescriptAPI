import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
  MetaReducer,
} from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { environment } from '../../environments/environment';
import * as fromRouter from '@ngrx/router-store';
import { RouterStateUrl } from '../shared/utils';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */

import * as fromTranactions from './transactions';
import * as fromStartService from './startservice';
import * as fromVUM from './vum';
import * as fromPaymentHistory from './paymenthistory'
import * as fromPreviousBills from './previousbills'
import * as fromAddUser from './adduser'
import * as fromLoggedInUser from './loggedinuser'
import * as fromManageUser from './manageuser'
import * as fromUpdateUser from './updateuser'
import * as fromESIID from './esiid'
import * as fromSelectedProperty from './selectedproperty'
import * as fromBilling from './billing'
import * as fromPlanDetails from './plandetails'

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
    transactions: fromTranactions.State;
    startservice: fromStartService.State;
    vum: fromVUM.State;
    paymenthistory: fromPaymentHistory.State;
    previousbills: fromPreviousBills.State;
    adduser: fromAddUser.State;
    loggedinuser: fromLoggedInUser.State;
    manageuser: fromManageUser.State;
    updateuser: fromUpdateUser.State;
    esiid: fromESIID.State;
    selectedproperty: fromSelectedProperty.State;
    billing: fromBilling.State;
    plandetails: fromPlanDetails.State;
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<State> = {
    transactions: fromTranactions.reducer,
    startservice: fromStartService.reducer,
    vum: fromVUM.reducer,
    paymenthistory: fromPaymentHistory.reducer,
    previousbills: fromPreviousBills.reducer,
    adduser: fromAddUser.reducer,
    loggedinuser: fromLoggedInUser.reducer,
    manageuser: fromManageUser.reducer,
    updateuser: fromUpdateUser.reducer,
    esiid: fromESIID.reducer,
    selectedproperty: fromSelectedProperty.reducer,
    billing: fromBilling.reducer,
    plandetails: fromPlanDetails.reducer,
    routerReducer: fromRouter.routerReducer,
};

/*localstorage setup for the store
  Provide state (reducer) keys to sync with local storage. Returns a meta-reducer.
*/

const reducerKeys = ['transactions','startservice','vum','paymenthistory','previousbills','adduser','loggedinuser','manageuser','updateuser','esiid','selectedproperty','billing'];
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: reducerKeys})(reducer);
}

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger, storeFreeze,localStorageSyncReducer]
  : [localStorageSyncReducer];

/* Transactions State start */
export const getTransactionState = createFeatureSelector<fromTranactions.State>('transactions');

export const listTransactions = createSelector(
  getTransactionState,
  fromTranactions.getTransactions
);

export const getDetailTransaction = createSelector(
  getTransactionState,
  fromTranactions.getDetailTransaction
);

/* Transactions State end */

/* Start Service State start */
export const getStartServiceState = createFeatureSelector<fromStartService.State>('startservice');

export const listPorpertyAddress = createSelector(
   getStartServiceState,
   fromStartService.getPropertyAddressList
)

export const getSelectedServiceProperty = createSelector(
    getStartServiceState,
    fromStartService.getSelectedProperty
)

export const getSelectedUnits = createSelector(
    getStartServiceState,
    fromStartService.getSelectedUnits
)

export const getSelectedSrvcAddrDetails = createSelector(
    getStartServiceState,
    fromStartService.getSelectedServiceAddrDetails
)

export const getStartServiceConfirmation = createSelector(
    getStartServiceState,
    fromStartService.getStartConfirmation
)
/* Start Service State end */

/* Plan Details Start */
export const getPlanDetailsState = createFeatureSelector<fromPlanDetails.State>('plandetails');

export const getPlanDetails = createSelector(
    getPlanDetailsState,
    fromPlanDetails.getPlanDetails
)

/* Plan Details End */

/* VUM start */
export const getVUMState = createFeatureSelector<fromVUM.State>('vum');

export const getVacantDailyReport = createSelector(
   getVUMState,
   fromVUM.getDailyReportList
)

/* VUM end */


/* Previous Bills start */
export const getPreviousBillsState = createFeatureSelector<fromPreviousBills.State>('previousbills');

export const getPreviousBills = createSelector(
   getPreviousBillsState,
   fromPreviousBills.getPreviousBills
)
/* Previous Bills end */

/* Payment History start */
export const getPaymentHistoryState = createFeatureSelector<fromPaymentHistory.State>('paymenthistory');

export const getPaymentHistoryList = createSelector(
   getPaymentHistoryState,
   fromPaymentHistory.getPaymentHistoryList
)

/*  Payment History end */

/* Billing start */
export const getBillingState = createFeatureSelector<fromBilling.State>('billing');

export const getContractAccountList = createSelector(
   getBillingState,
   fromBilling.getContractAccountList
)

export const getBillingInvoices = createSelector(
   getBillingState,
   fromBilling.getBillingInvoices
)
/*  Billing end */

/* Profile Add user start */
export const getAddUserState = createFeatureSelector<fromAddUser.State>('adduser');

export const getSavedUserInfo = createSelector(
   getAddUserState,
   fromAddUser.getSavedUserInfo
)

export const isUserValidated = createSelector(
   getAddUserState,
   fromAddUser.isUserValidated
)

export const getUserConfirmation = createSelector(
   getAddUserState,
   fromAddUser.getSaveUserConfirmation
)

/*  Profile Add user end */

/* Profile Manage user start */
export const getManageUserState = createFeatureSelector<fromManageUser.State>('manageuser');

export const getAssociates = createSelector(
  getManageUserState,
  fromManageUser.listAssociates
)

export const getUserProfileDetails = createSelector(
  getManageUserState,
  fromManageUser.getUserProfileDetails
)

export const getUserNameForProfileDetails = createSelector(
  getManageUserState,
  fromManageUser.getUserNameForProfileDetails
)
/*  Profile Manage user end */

/* Profile Update user start */
export const getUpdateUserState = createFeatureSelector<fromUpdateUser.State>('updateuser');

export const getUserUpdatedDtls = createSelector(
  getUpdateUserState,
  fromUpdateUser.getUserUpdatedDtls
)

export const getUsersForUpdate = createSelector(
  getUpdateUserState,
  fromUpdateUser.getUsersForUpdate
)
/*  Profile Update user end */

/* Loggedin user start */
export const getLoggedInUserState = createFeatureSelector<fromLoggedInUser.State>('loggedinuser');

export const getLoggedInUser = createSelector(
   getLoggedInUserState,
   fromLoggedInUser.getLoggedInUser
)

export const getLoggedInUserHierarchyDtls = createSelector(
   getLoggedInUserState,
   fromLoggedInUser.getLoggedInUserHierarchyDtls
)

export const getLoggedInUserCustomerList = createSelector(
   getLoggedInUserState,
   fromLoggedInUser.getLoggedInUserCustomerList
)

export const getLoggedInUserSecurityRole = createSelector(
   getLoggedInUserState,
   fromLoggedInUser.getLoggedInUserSecurityRole
)

export const getLoggedInUserSecurityRoleDisplayName = createSelector(
   getLoggedInUserState,
   fromLoggedInUser.getLoggedInUserSecurityRoleDisplayName
)


/* Loggedin User end */


/* ESIID calls start */

export const getESIIDState = createFeatureSelector<fromESIID.State>('esiid');

export const getESIIDList = createSelector(
   getESIIDState,
   fromESIID.getESIIDList
)
/* ESIID calls end */

/* Selected Property calls start */

export const getSelectedpropertyState = createFeatureSelector<fromSelectedProperty.State>('selectedproperty');

export const getRelationshipId = createSelector(
   getSelectedpropertyState,
   fromSelectedProperty.getRelationshipId
)

export const getSelectedProperty = createSelector(
   getSelectedpropertyState,
   fromSelectedProperty.getSelectedProperty
)

export const getNONCAARealBPList = createSelector(
   getSelectedpropertyState,
   fromSelectedProperty.getNONCAARealBPList
)

export const getCustomerDetails = createSelector(
   getSelectedpropertyState,
   fromSelectedProperty.getCustomerDetails
)

export const getSelectedpropertyName = createSelector(
   getSelectedpropertyState,
   fromSelectedProperty.getSelectedpropertyName
)

export const getRelationshipIdForStartStopTxn = createSelector(
   getSelectedpropertyState,
   fromSelectedProperty.getRelationshipIdForStartStopTxn
)

export const getStrNodeGuidForStartStopTxn = createSelector(
   getSelectedpropertyState,
   fromSelectedProperty.getStrNodeGuidForStartStopTxn
)


/* Selected Property calls end */
