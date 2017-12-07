import * as profile from '../actions/profile';

export interface State {
    updateUserDtls: any;
    userList: any;
}

const initialState: State = {
    updateUserDtls: {},
    userList:undefined
};

export function reducer(state= initialState, action: profile.Actions): State {

    switch(action.type) {

        case profile.UPDATE_USER: return {...state, updateUserDtls: {}};
        case profile.UPDATE_USER_SUCCESS: return {...state, updateUserDtls: action.payload};
        case profile.UPDATE_USER_FAILURE: return {...state, updateUserDtls: action.payload};

        case profile.SEARCH_USERS_FOR_UPDATE: return {...state, userList: undefined};
        case profile.SEARCH_USERS_FOR_UPDATE_SUCCESS: return {...state, userList: action.payload};
        case profile.SEARCH_USERS_FOR_UPDATE_FAILURE: return {...state, userList: action.payload};


        default: return state
    }
}

export const getUserUpdatedDtls = (state: State) => state.updateUserDtls;
export const getUsersForUpdate = (state: State) => state.userList;
