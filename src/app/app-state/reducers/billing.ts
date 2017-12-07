import * as billing from '../actions/billing';

export interface State {
    isLoading: boolean;
    isLoadingSuccess: boolean;
    contractAccountList: any;
    invoices: any;
}

const initialState: State = {
    isLoading: false,
    isLoadingSuccess: false,
    contractAccountList: undefined,
    invoices: undefined
};

export function reducer(state= initialState, action: billing.Actions): State {

    switch(action.type) {

        case billing.GET_CONTRACT_ACCOUNT_LIST: return {...state,isLoading: true,isLoadingSuccess: false,contractAccountList: undefined};
        case billing.GET_CONTRACT_ACCOUNT_LIST_SUCCESS: return {...state,isLoading: false,isLoadingSuccess: true,contractAccountList: action.payload};
        case billing.GET_CONTRACT_ACCOUNT_LIST_FAILURE: return {...state,isLoading: false,isLoadingSuccess: false,contractAccountList: action.payload};

        case billing.GET_BILLING_INVOICE_LIST: return {...state,isLoading: true,invoices: undefined};
        case billing.GET_BILLING_INVOICE_LIST_SUCCESS:
            let isLoadingSuccess = false;
            if(action.payload.structuralDetailsFound && action.payload.arDetailsFound){isLoadingSuccess = true;}
          return {...state,isLoading: false,isLoadingSuccess: isLoadingSuccess, invoices: action.payload};
        case billing.GET_BILLING_INVOICE_LIST_FAILURE: return {...state,isLoading: false,isLoadingSuccess: false,invoices: action.payload};

        default: return state
    }
}

export const getContractAccountList = (state: State) => state.contractAccountList;
export const getBillingInvoices = (state: State) =>
  {
    return{
        invoices: state.invoices,
        isLoading: state.isLoading,
        isLoadingSuccess: state.isLoadingSuccess
    }
  }
