
import * as startservice from '../actions/startservice';
import { MFPropertyAddress } from '../models/service/startservice.model';
import * as _ from 'lodash';

export interface State {
    isLoading: boolean;
    isLoadingSuccess: boolean;
    propertyAddrList: any;
    selectedproperty: any;
    selectedUnits: any;
    confirmation: any;
}

const initialState: State = {
    isLoading: false,
    isLoadingSuccess: false,
    propertyAddrList: undefined,
    selectedproperty: {},
    selectedUnits: [],
    confirmation:{}
};

export function reducer(state= initialState, action: startservice.Actions): State {

    switch(action.type) {

        case startservice.LIST_PROPERTY_ADDRESS:
            return {...state,isLoading: true,isLoadingSuccess: false};

        case startservice.LIST_PROPERTY_ADDRESS_SUCCESS:
            return {...state,isLoading: true,isLoadingSuccess: false,propertyAddrList: action.payload};

        case startservice.LIST_PROPERTY_ADDRESS_FAILURE:
            return {...state,isLoading: true,isLoadingSuccess: false,propertyAddrList: action.payload};

        case startservice.SAVE_SELECTED_PROPERTY:
            return {...state,isLoading: true,isLoadingSuccess: false,propertyAddrList:state.propertyAddrList, selectedproperty:action.payload };

        case startservice.SAVE_SELECTED_UNITS:
            return {...state,isLoading: true,isLoadingSuccess: false,propertyAddrList:state.propertyAddrList, selectedproperty:state.selectedproperty, selectedUnits:action.payload }

        case startservice.SUBMIT_START_SERVICE: return {...state, confirmation:{}}

        case startservice.SUBMIT_START_SERVICE_SUCCESS:
              let propertyAddrList = _.cloneDeep(state.propertyAddrList);
                    return {
                          ...state,
                          confirmation:action.payload,
                          propertyAddrList: propertyAddrList.forEach(srvAddr => {
                              if(srvAddr.streetAddress == state.selectedproperty.streetAddress){
                                  srvAddr.unitList.forEach(unit => {
                                      state.selectedUnits.forEach(seldUnit => {
                                          console.log(seldUnit.strUnitNumber)
                                          console.log(unit.strUnitNumber)
                                          if(unit.strUnitNumber == seldUnit.strUnitNumber){
                                              console.log("chnaging status to pending for unit number:::"+unit.strUnitNumber)
                                              unit.pending = true;
                                          }
                                      })
                                  })
                              }
                          })}

        case startservice.SUBMIT_START_SERVICE_FAILURE: return {...state}

        case startservice.SUBMIT_STOP_SERVICE: return {...state, confirmation:{}}

        case startservice.SUBMIT_STOP_SERVICE_SUCCESS: return {...state, confirmation:action.payload}

        case startservice.SUBMIT_STOP_SERVICE_FAILURE: return {...state}

        default: return state
    }
}

export const getPropertyAddressList = (state: State) => state.propertyAddrList;
export const getSelectedProperty = (state: State) => state.selectedproperty;
export const getSelectedUnits = (state: State) => state.selectedUnits;
export const getSelectedServiceAddrDetails = (state: State) => {
    let selProp = state.selectedproperty;
    return {streetAddress: selProp.streetAddress, city: selProp.city, state:selProp.state,zipcode:selProp.zipcode}
}
export const getStartConfirmation = (state:State) => state.confirmation;
