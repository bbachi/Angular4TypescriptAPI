import * as selectedproperty from '../actions/selectedproperty';

export interface State {
    relationshipId: string;
    selectedProperty: any;
}

const initialState: State = {
    relationshipId: "",
    selectedProperty: {},
};

export function reducer(state= initialState, action: selectedproperty.Actions): State {

    switch(action.type) {

        case selectedproperty.SAVE_RELATIONSHIP_ID: return {...state, relationshipId:action.payload};
        case selectedproperty.SAVE_SELECTED_PROPERTY_DTLS: return {...state, selectedProperty:action.payload};

        case selectedproperty.GET_SELECTED_PROPERTY_DTLS: return {...state};
        case selectedproperty.GET_SELECTED_PROPERTY_DTLS_SUCCESS: return {...state, selectedProperty:action.payload};
        case selectedproperty.GET_SELECTED_PROPERTY_DTLS_SUCCESS: return {...state, selectedProperty:action.payload};

        default: return state
    }
}

export const getRelationshipId = (state: State) => state.relationshipId;
export const getSelectedProperty = (state: State) => state.selectedProperty;
export const getNONCAARealBPList = (state: State) => state.selectedProperty.NONCAABPList
export const getCustomerDetails = (state: State) => state.selectedProperty.customerDtls;
export const getSelectedpropertyName = (state: State) => state.selectedProperty.bpName;
export const getRelationshipIdForStartStopTxn = (state: State) => state.selectedProperty.customerDtls.relationshipId
export const getStrNodeGuidForStartStopTxn = (state: State) => state.selectedProperty.strNodeGuidForStartStopTxn
