import * as paymentHistory from '../actions/paymenthistory';
import { PaymentHistory } from '../models/billing/billing';

export interface State {
    isLoading: boolean;
    isLoadingSuccess: boolean;
    paymentHistoryList: PaymentHistory[];
}

const initialState: State = {
    isLoading: false,
    isLoadingSuccess: false,
    paymentHistoryList: []
};

export function reducer(state= initialState, action: paymentHistory.Actions): State {

    switch(action.type) {

        case paymentHistory.GET_PAYMENT_HISTORY: return {...state,isLoading: true,isLoadingSuccess: false,paymentHistoryList: []};
        case paymentHistory.GET_PAYMENT_HISTORY_SUCCESS: return {...state,isLoading: true,isLoadingSuccess: false,paymentHistoryList: action.payload};
        case paymentHistory.GET_PAYMENT_HISTORY_FAILURE: return {...state,isLoading: true,isLoadingSuccess: false,paymentHistoryList: action.payload};

        default: return state
    }
}

export const getPaymentHistoryList = (state: State) => state.paymentHistoryList;
