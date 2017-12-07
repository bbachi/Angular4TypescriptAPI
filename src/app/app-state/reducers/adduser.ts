import * as profile from '../actions/profile';
import { User } from '../models/profile/profile';

export interface State {
    isLoading: boolean;
    isLoadingSuccess: boolean;
    user: any;
    isUserNameValidedInLDAP: boolean;
    confirmation: any;
}

const initialState: State = {
    isLoading: false,
    isLoadingSuccess: false,
    user: {},
    isUserNameValidedInLDAP: false,
    confirmation: undefined,
};

export function reducer(state= initialState, action: profile.Actions): State {

    switch(action.type) {

        case profile.ADD_USER_SAVE_INFO: return {...state,isLoading: true,isLoadingSuccess: false, user: action.payload};

        case profile.VALIDATE_USER_NAME: return {...state };

        case profile.VALIDATE_USER_NAME_SUCCESS: return {...state, isUserNameValidedInLDAP: action.payload};

        case profile.VALIDATE_USER_NAME_FAILURE: return {...state, isUserNameValidedInLDAP: action.payload};

        case profile.SAVE_USER: return {...state, user: state.user};

        case profile.SAVE_USER_SUCCESS: return {...state, user: state.user, confirmation: action.payload};

        case profile.SAVE_USER_FAILURE: return {...state, user: state.user, confirmation: action.payload};

        default: return state
    }
}

export const getSavedUserInfo = (state: State) => state.user;
export const isUserValidated = (state: State) => state.isUserNameValidedInLDAP
export const getSaveUserConfirmation = (state: State) => state.confirmation
