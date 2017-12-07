import * as esiid from '../actions/esiid';

export interface State {
    esiidList: any;
}

const initialState: State = {
    esiidList: undefined
};

export function reducer(state= initialState, action: esiid.Actions): State {

    switch(action.type) {

        case esiid.GET_ESIID_LIST: return {...state};
        case esiid.GET_ESIID_LIST_SUCCESS: return {...state, esiidList:action.payload};
        case esiid.GET_ESIID_LIST_FAILURE: return {...state, esiidList:action.payload};

        default: return state
    }
}

export const getESIIDList = (state: State) => state.esiidList;
