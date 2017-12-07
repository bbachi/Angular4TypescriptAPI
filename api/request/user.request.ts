import { BaseRequest } from './base.request';

export class FirstLogonFlagRequest extends BaseRequest {

    userName: string;
}

export class UserProfileWithBPHierarchyRequest extends BaseRequest {

    strUserName: string;
}

export class GetAssociatesRequest extends BaseRequest{
     bcadminUserName:string;
}

export class UpdateUserRequest extends BaseRequest {
    userName: string;
    fieldIndicator: string;
    fieldValue1: string;
    fieldValue2: string;
    portal: string;
    bpNumber: string;
}

export class SearchUsersForUpdateRequest extends BaseRequest {

      searchString: string;
      searchCriteria: string;
      webSecurityRole: string;
      userCategory: string;
      userType: string;
}

export class ValidateUsrNameRequest extends BaseRequest {

    strLDAPOrg: string;
    strUserName: string;
    strProviderUrl: string;
    strCompanyCode: string;
    strSSOUserType: string;
}

export class CreateUsrRequest extends BaseRequest {

    strEmailId: string;
    strFirstName: string;
    strLastName: string;
    strPassword: string;
    strUserName: string;
    strSSOUserType: string;
    strLDAPOrg: string;
    strCompanyCode: string;
    strReliantUserType: string;
    strBpId:string;
    strCAType:string;
    strProviderUrl:string;
}

export class AddUserRequest extends BaseRequest {

    altrContactPhone: string;
    altrContactPhoneExtn: string;
    associatedAdminUsername: string;
    billingAce: string;
    billingAceList: string[];
    bpAddressList: string[];
    bpNameList: string[];
    bpNumberList: string[];
    brokerBPName: string;
    brokerBPNumber: string;
    contactPhone: string;
    contactPhoneExtn: string;
    emailId: string;
    faxNumber: string;
    firstName: string;
    hierarchyLevelList: string[];
    lastName: string;
    sapId: string;
    startStopAce: string;
    startStopAceList: string[];
    title: string;
    userName: string;
    webSecurityRole: string;
    linkTxnId:string;
}

export class ResetPwdDtlsRequest extends BaseRequest{
  txnId: string;
  userName: string;
  expirationDate:string;

}
