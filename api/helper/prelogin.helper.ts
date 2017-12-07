import LoggerUtil from './../logs/log';
import Promise = require('tspromise');
import * as cst from './../util/constant';
import { CommonUtil } from './../util/common.util';
import { PreLoginService } from './../services/prelogin.service';
import { Error } from './../model/error';
import {BPHierarchyDtlsResponse} from './../model/bphierarchydtlsresponse';
import {HierarchyDtlsDO} from './../model/bphierarchydtlsresponse';
import {CustomerDetails} from './../model/customerdetails';
import {AccessPrivilegesRequest, GetCustomerContractRequest, BPHierarchyRequest, BPHierarchyDtlsRequest } from './../request/prelogin.request';
import {CustomerContractDO} from './../model/customercontractdo';
import { FirstLogonFlagRequest, UserProfileWithBPHierarchyRequest } from '../request/user.request';
import { FirstLogOnFLag, User } from '../model/user.model'
import { CommonUtilityHelper } from './commonutility.helper';
import { BMFSSSession } from './../model/bmfss.session';
import { HierarchyDetails, ManagementBP, Region } from '../model/hierarchy.model';
import { Property } from '../model/bmfss.session';

export class PreloginHelper {

    private preloginService: PreLoginService;
    constructor(){
        this.preloginService = new PreLoginService();
    }


     public getFirstLogonFlag(req: any): Promise<any> {

          LoggerUtil.info("GETTING FIRST LOGON FLAG FOR THE USERNAME:::::"+req.body.userName)
          let inReq = this.populateFirstLogonFlagRequest(req.body.userName);
          var p = new Promise((resolve, reject) => {
              this.preloginService.getFirstLogOnFlag(inReq).then(s => {
                let flag = new FirstLogOnFLag();
                flag.userName = req.body.userName;
                if(undefined != s && s.dataAvailForInput) {
                    flag.firstLogonFlag = s.firstLogonFlag;
                    resolve(flag);
                }else{
                    resolve(new Error(0,"no response"))
                }
              })
          });
          return p;
      }

      public setFirstLogonFlag(req: any): Promise<any> {

           LoggerUtil.info("SETTING FIRST LOGON FLAG FOR THE USERNAME:::::"+req.body.userName)
           let inReq = this.populateFirstLogonFlagRequest(req.body.userName);
           var p = new Promise((resolve, reject) => {
               this.preloginService.setFirstLogOnFlag(inReq).then(s => {
                 let flag = new FirstLogOnFLag();
                 flag.userName = req.body.userName;
                 if(undefined != s && s.dataAvailForInput) {
                     resolve(s.dataAvailForInput);
                 }else{
                     resolve(new Error(0,"no response"))
                 }
               })
           });
           return p;
       }

      private populateFirstLogonFlagRequest(userName: string): FirstLogonFlagRequest {

          let inReq = new FirstLogonFlagRequest();
          inReq.strPortal = cst.GMESS_PORTAL;
          inReq.strCompanyCode = cst.GMESS_CC_0270;
          inReq.userName = userName;
          return inReq;
      }

      public getUserProfileDetails(req: any): Promise<any> {

          LoggerUtil.info("GETTING USER PROFILE DETAILS FOR THE USERNAME:::::"+req.body.userName);
          let inReq = new UserProfileWithBPHierarchyRequest();
          inReq.strPortal = cst.GMESS_PORTAL;
          inReq.strCompanyCode = cst.GMESS_CC_0270;
          inReq.strLoggedInUserName = req.body.userName;
          inReq.strUserName = req.body.userName;
          var p = new Promise((resolve, reject) => {
            this.preloginService.getUserProfileWithBPHierarchy(inReq).then(s => {
                let user = new User();
                if(undefined != s && undefined != s.userProfileDO){
                    LoggerUtil.info("NO USER FOUND FOR THE USERNAME::::"+req.body.userName);
                    let processResp = this.processUserFromResp(s);
                    let bmfSSSession = new BMFSSSession();
                    bmfSSSession.loggedInUser = processResp[0];
                    bmfSSSession.bpDtlsList = processResp[2];
                    req.session.bmfSSSession = bmfSSSession;
                    resolve({user:processResp[0], customerList:processResp[1]});
                }else{
                    LoggerUtil.info("NO USER FOUND FOR THE USERNAME::::"+req.body.userName);
                    resolve(new Error(0,"no response"))
                }
              });
          });
          return p;
    }


    private processUserFromResp(s: any): any {

      let user = new User();
      let hierarchyDtls;
      let customerList;
      try{
          user = this.getUserFromResp(s);
          let isBroker = CommonUtil.isBrokerOrBrokerAssociate(user.webSecurityRole);
          if(CommonUtil.isUserHasAssociations(user.webSecurityRole)){
              customerList = this.populateCustomerList(s,isBroker,user.brokerBPNumber)
              hierarchyDtls = this.getHierarchyDetailsFromManagementList(customerList,undefined,undefined,user);
          }
      }catch(e){
        LoggerUtil.info("Error=======>"+e.message);
      }
      return [user,hierarchyDtls,customerList];
    }


    private getUserFromResp(s: any): User {

      let user = new User();
      try{
          user.firstName = s.userProfileDO.firstName;
          user.lastName = s.userProfileDO.lastName;
          user.userName = s.userProfileDO.userName;
          user.altPhoneNum = s.userProfileDO.altrContactPhone;
          user.altPhoneNumExtn = s.userProfileDO.altContactPhoneExtn;
          user.phoneNum = s.userProfileDO.contactPhone;
          user.phoneNumExtn = s.userProfileDO.contactPhoneExtn;
          user.faxNum = s.userProfileDO.faxNumber;
          user.startStopAce = s.userProfileDO.startStopAce;
          user.billingAce = s.userProfileDO.billingAce;
          user.email = s.userProfileDO.emailId;
          user.securityRole = CommonUtil.getWebSecurityRoleFromDBRoles(s.userProfileDO.webSecurityRole);
          user.securityRoleDisplayName = CommonUtil.getSecurityRoleFromDBRoles(s.userProfileDO.webSecurityRole);
          user.userType = s.userProfileDO.userType;
          user.webSecurityRole = s.userProfileDO.webSecurityRole;
          user.userCategory = s.userProfileDO.userCategory;
          user.brokerBPNumber = s.userProfileDO.brokerBPNumber;
          if(CommonUtil.equalsIgnoreCase(s.userProfileDO.securityRole, cst.SECURITY_ROLE_AGT) ||
            CommonUtil.equalsIgnoreCase(s.userProfileDO.securityRole, cst.SECURITY_ROLE_CUS_ADMIN)){
              user.userTypeDisplayName = s.userProfileDO.userTypeDisplay;
          }else{
              user.userTypeDisplayName = cst.NA;
          }
        }catch(e){
          LoggerUtil.info("Error=======>"+e.message);
        }
        return user;
    }


    private populateCustomerList(s: any, isBroker:boolean, brokerBPNumber:string) : ManagementBP[]{

          let mngtList = new Array<ManagementBP>();
          try{
              let mngList = undefined != s.managementList?s.managementList:[];
              let rgnList = undefined != s.regionList?s.regionList:[];
              let propList = undefined != s.propertyList?s.propertyList:[];
              mngList.forEach((mng:any) => {
                  let mngBP = new ManagementBP();
                  mngBP.bpNumber = CommonUtil.substringBefore(mng.bpNumber,":")
                  let treeGUID = CommonUtil.substringAfter(mng.bpNumber, ":");
                  mngBP.bpName = mng.bpName;
                  mngBP.strBPAddress = CommonUtil.createBpAddressStrFromObj(mng.bpAdress);
                  mngBP.newlyAddedBP = mng.newlyAddedBP;
                  mngBP.fedTaxId = mng.fedTaxId
                  mngBP.regionList = this.getRegionList(rgnList,propList,mng.bpNumber,isBroker,s.hierarchyType,brokerBPNumber,treeGUID);
                  mngtList.push(mngBP);
              })
          }catch(err){
            LoggerUtil.info("ERROR=======>"+err.message)
          }
          return mngtList;
      }




     private  getStatusForBrokerAssignedOrNot( enteredBrokerNumber:string, brokerList:Array<any>, treeGUID:string):boolean{

         let brokerBPList = (null != brokerList)?brokerList:new Array<string>();
         let isBrokerAssignedOrNot: boolean = false;
         if(CommonUtil.isNotBlank(enteredBrokerNumber)){
             brokerBPList.forEach((brokerBP:string) => {
                 let brokerBPNum = brokerBP.substring(brokerBP.lastIndexOf("!")+1,brokerBP.lastIndexOf(":"));
                 let brokerTreeGuid = brokerBP.split("#").pop();
                 if(CommonUtil.equalsIgnoreCase(brokerBPNum, enteredBrokerNumber) && CommonUtil.equalsIgnoreCase(treeGUID, brokerTreeGuid)){
                      isBrokerAssignedOrNot =  true;
                 }
           });
         }else{
           isBrokerAssignedOrNot = true;
         }
         LoggerUtil.info("CHECKING THE BROKER ASSIGNED OR NOT:::::FOR THE BROKER BP:::"+enteredBrokerNumber+":::IN BROKER LIST:::"+JSON.stringify(brokerList)+":::STATUS:::"+isBrokerAssignedOrNot);
         return isBrokerAssignedOrNot;
   }


    public searchByBpNumber(req: any): Promise<any> {

        var bpList = new Array<string>();
        bpList.push(CommonUtil.leftPadZeros(req.body.bpNumber,10));
        let bpHierReq = new BPHierarchyRequest();
        bpHierReq.bpNumberList = bpList;
        bpHierReq.callType = "";
        bpHierReq.strCompanyCode= cst.GMESS_CC_0270;
        bpHierReq.strPortal =cst.USERTYPE_SP_EXTERNAL_PORTAL;
        bpHierReq.strLoggedInUserName = CommonUtil.getLoggedInUserName(req);
        var p = new Promise((resolve, reject) => {
            this.preloginService.getBPHierarchy(bpHierReq).then(s => {
                let dtls = this.processHierarchyDetails(req,s,bpList[0]);
                req.session.bmfSSSession.hierarchyDtls = dtls;
                resolve(dtls);
            });
        });
       return p;

   }

   private processHierarchyDetails(req: any,s: any, enteredBpNumber: string): HierarchyDetails {

      let dtls = new HierarchyDetails();
      if(undefined != s && s.dataAvilableForInput){
          dtls.found = true;
          let mngtList = new Array<ManagementBP>();
          s.managementList.forEach((mng: any) => {
              if(CommonUtil.isNotBlank(mng.bpNumber)){
                  let mngmt = new ManagementBP();
                  mngmt.bpNumber = CommonUtil.substringBefore(mng.bpNumber,":");
                  mngmt.strBPAddress = CommonUtilityHelper.createBpAddressStrFromObj(mng.bpAdress);
                  mngmt.bpName = mng.bpName;
                  mngmt.fedTaxId = mng.fedTaxId;
                  let treeGUID: string = CommonUtil.substringAfter(mng.bpNumber, ":");
                  mngmt.regionList = this.getRegionList(s.regionList,s.propertyList,mng.bpNumber,false,s.hierarchyType,enteredBpNumber,treeGUID);
                  mngtList.push(mngmt);
              }
          })
          console.log("LENGTH===========>"+mngtList.length);
          req.session.bmfSSSession.bpDtlsList = mngtList;
          let bpList = new Array<string>();
          bpList.push(enteredBpNumber);
          dtls = this.getHierarchyDetailsForInternalUserSearchForNonBroker(dtls,mngtList,bpList);
      }
      return dtls;
   }


   private getRegionList(rgnList: any[], propList: any[], mngBpNumber:string, isBroker:boolean, hierarchyType: string, enteredBPNumber: string, treeGUID: string): Region[]{

       let regList = new Array<Region>();
       rgnList.forEach(rgnHrchy => {
         if(CommonUtil.equalsIgnoreCase(rgnHrchy.parentBpNumber, mngBpNumber)){
              let reg = new Region;
              reg.bpNumber = CommonUtil.substringBefore(rgnHrchy.bpNumber,":");
              reg.bpName = rgnHrchy.bpName;
              reg.fedTaxId = rgnHrchy.fedTaxId;
              if(isBroker){
                 LoggerUtil.info("CHECKING THE BORKER ASSIGNED OR NOT FOR THE REGION BP NAME::::::"+reg.bpName);
                 reg.bokerAssigned = this.getStatusForBrokerAssignedOrNot(enteredBPNumber,rgnHrchy.brokerList,treeGUID);
                 reg.newlyAddedBP = rgnHrchy.newlyAddedBP;
              }
              reg.strBPAddress = CommonUtilityHelper.createBpAddressStrFromObj(rgnHrchy.bpAdress);
              reg.propertyList = this.getPropertyList(propList,rgnHrchy.bpNumber,isBroker,reg.bokerAssigned,enteredBPNumber,hierarchyType,treeGUID);
              regList.push(reg);
          }
       });
       LoggerUtil.info("RETURNING REGION LIST OF SIZE FOR THE MANAGEMENT BP NUMBER:::::::"+mngBpNumber+"::::SIZE:::"+regList.length);
       return regList;
   }


   private getPropertyList(propList: any[], regBpNumber: string, isBroker:boolean, brokerAssignedAtRegLevel:boolean, enteredBPNumber:string, hierarchyType: string, treeGUID: string){

       let propertyList = new Array<Property>();
       try{
         propList.forEach(propHrchy => {
            if(CommonUtil.equalsIgnoreCase(propHrchy.parentBpNumber, regBpNumber) && CommonUtil.equalsIgnoreCase(treeGUID, propHrchy.treeGuid)){
                let prop = new Property();
                prop.relationshipId = CommonUtil.substringBefore(propHrchy.bpNumber, ":");
                prop.phoneNum = ""; //TODO:not coming in the hierarchy read call
                prop.bpName = propHrchy.bpName;
                prop.MSTRCAARelationshipId = propHrchy.masterBPForCAA;
                prop.MSTRRelationshipId = propHrchy.masterBPForCSAorNCSAorSITE;
                prop.strNodeGuidForStartStopTxn = this.getNodeGuidFromNONCAAorSITEBPnumberListForStartStopTXN(propHrchy.csabpnumberList,propHrchy.ncsabpnumberList,propHrchy.sitebpnumberList);
                prop.siteBPNumberList = this.subStringBPNumberFromNodeGuid(propHrchy.sitebpnumberList);
                prop.CAABPList = this.subStringBPNumberFromNodeGuid(propHrchy.caabpnumberList);
                prop.NONCAABPList = this.subStringBpNumberAndCreateNONCAAList(propHrchy.csabpnumberList,propHrchy.ncsabpnumberList);
                prop.fedTaxId = propHrchy.fedTaxId;
                LoggerUtil.info("FEDERAL TAX ID FOR THE PROPERTY:::::"+prop.fedTaxId+":::PROPERTY::::"+prop.bpName);
                prop.address = CommonUtilityHelper.mapAddressFromServiceLayerToAddressInFE(propHrchy.bpAdress);
                prop.propertyType = hierarchyType;
                prop.startEnabled = CommonUtil.equalsIgnoreCase(propHrchy.startStopAce, cst.YES);
                prop.billingEnabled = CommonUtil.equalsIgnoreCase(propHrchy.billingAce, cst.YES);
                if(isBroker){
                    prop.bokerAssigned = brokerAssignedAtRegLevel?brokerAssignedAtRegLevel:this.getStatusForBrokerAssignedOrNot(enteredBPNumber,propHrchy.brokerList,treeGUID)
                    if(prop.bokerAssigned){
                      propertyList.push(prop);
                    }
                }else{
                    propertyList.push(prop);
                }
            }
         });
       }catch(e){
         console.log("ERROR==========>"+e);
       }
       LoggerUtil.info("RETURNING PROPERTY LIST OF SIZE FOR THE REGION BP NUMBER:::::::"+regBpNumber+"::::SIZE:::"+propertyList.length);
       return propertyList;
   }



   private getNodeGuidFromNONCAAorSITEBPnumberListForStartStopTXN(CSABPNumberAry: string[], NCSABPNumberAry: string[], siteBPNumAry: string[]): string{

       let nodeGuid: string = cst.EMPTY_STR;
       if(undefined != siteBPNumAry && siteBPNumAry.length >0){
         nodeGuid = CommonUtil.substringAfter(siteBPNumAry[0], cst.COLON);
       }else{
         if(undefined != CSABPNumberAry && CSABPNumberAry.length >0){
           nodeGuid = CommonUtil.substringAfter(CSABPNumberAry[0], cst.COLON);
         }else if(undefined != NCSABPNumberAry && NCSABPNumberAry.length >0){
           nodeGuid = CommonUtil.substringAfter(NCSABPNumberAry[0], cst.COLON);
         }
       }
       LoggerUtil.info("NODE GUID FOR THE START/STOP TRANSACTION:::::::::"+nodeGuid);
       return nodeGuid;
  }


  private subStringBPNumberFromNodeGuid(bpNumberAry: string[]): string[]{

  		let bpNumberList = new Array<string>();
  		if(undefined != bpNumberAry && bpNumberAry.length > 0){
        bpNumberAry.forEach(bpNumber => {
            bpNumberList.push(CommonUtil.substringBefore(bpNumber, ":"));
        });
  		}
  		return bpNumberList;
	}

  private subStringBpNumberAndCreateNONCAAList(csaBPNumAry: string[], ncsaBPNumAry: string[]): string[] {

  		let bpNumberList = new Array<string>();
  		if(undefined != csaBPNumAry){
        csaBPNumAry.forEach(bpNumber => {
            bpNumberList.push(CommonUtil.substringBefore(bpNumber, ":"));
        });
  		}
  		if(undefined != ncsaBPNumAry){
        ncsaBPNumAry.forEach(bpNumber => {
            bpNumberList.push(CommonUtil.substringBefore(bpNumber, ":"));
        });
  		}
  		return bpNumberList;
	}


   private getHierarchyDetailsForInternalUserSearchForNonBroker(hierarchyDtls: HierarchyDetails,managementBPList: ManagementBP[], bpList: string[]): HierarchyDetails{

  		let mngmtList = new Array<ManagementBP>();
  		let regionList = new Array<Region>();
  		let propertyList = new Array<Property>();
      console.log(JSON.stringify(managementBPList))
  		managementBPList.forEach(mngBP => {
          console.log(CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(mngBP.bpNumber, ":")))
          if(CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(mngBP.bpNumber, ":")) || CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(mngBP.brokerBPNumber, ":"))){
            hierarchyDtls.mngBP = true;
            mngmtList.push(mngBP);
          }
          mngBP.regionList.forEach(rgn => {
              if(CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(rgn.bpNumber, ":")) || CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(rgn.brokerBPNumber, ":"))){
                  hierarchyDtls.regionBP = true;
                  regionList.push(rgn);
              }
              rgn.propertyList.forEach(prop => {
                  console.log(CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(prop.relationshipId, ":")))
                  if(CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(prop.relationshipId, ":")) || CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(prop.brokerBPNumber, ":"))){
                      hierarchyDtls.propertyBP = true;
                      propertyList.push(prop);
                  }
              });
            });
          });
          LoggerUtil.info("THE MANAGEMENT LIST:::::::::"+mngmtList.length);
      		LoggerUtil.info("THE REGION LIST:::::::::"+regionList.length);
      		LoggerUtil.info("THE PROPERTY LIST:::::::::"+propertyList.length);
      		hierarchyDtls.mngBPList = mngmtList;
      		hierarchyDtls.regionList = regionList;
      		hierarchyDtls.propertyList = propertyList;
      		return hierarchyDtls;
        }




/*
    public getSelectedAccountDetails(bpNumber:string, accountType:string, s:any): Promise<any>{

    var p = new Promise((resolve, reject) => {
        if( CommonUtil.isNotBlank(accountType)  && ((CommonUtil.equalsIgnoreCase(cst.SEARCH_TYPE_MANAGEMENT, accountType)) || (CommonUtil.equalsIgnoreCase(cst.SEARCH_TYPE_REGION, accountType)))){
            //var accDtls = new HierarchyDetails();
            //accDtls = this.searchBPNumberInSessionAndReturnBPHierarchyDetails(bpNumber,accountType,s);
            this.searchBPNumberInSessionAndReturnBPHierarchyDetails(bpNumber,accountType,s);
        }else{
            this.getSelectedPropertyDetailsAndUpdateSession(bpNumber,s);

        }
    });
        return p;

    }

    private getSelectedPropertyDetailsAndUpdateSession(relationshipId:string, s:any):Property{

        LoggerUtil.info("START::PreLoginHelper::getPropertyDetailsAndUpdateSession()>>>>>>");
		var strNodeGuidList :string[];
		var selectedProperty = new Property();
		LoggerUtil.info("GETTING THE PROPERTY DETAILS FOR THE RELATIONSHIP ID::::::::"+relationshipId);
		selectedProperty = this.returnSelectedPropertyFromSession(strNodeGuidList,selectedProperty,relationshipId,s);
	    let request = new BPHierarchyDtlsRequest();
        request.propNodeGuidList= strNodeGuidList;
        request.strCompanyCode = CommonUtil.getBMFSSSession(s).loggedInUser.companyCode;
        request.strPortal =cst.USERTYPE_SP_EXTERNAL_PORTAL;
        request.strLoggedInUserName = CommonUtil.getBMFSSSession(s).loggedInUser.userName;

        LoggerUtil.info("THE NODE GUID LIST FOR BP HIERARCHY DTLS::::::::::"+strNodeGuidList);
        var p = new Promise((resolve, reject) => {
            this.preloginService.getBPHierarchyDtls(request).then(t => {
                resolve(t);
                if(null != t && t.isDataAvilableForInput()){
                    selectedProperty = this.returnSelectedPropertyWithCustomerDtlsFromResponse(t,selectedProperty);
                    selectedProperty = this.returnSelectedPropertyWithAccessPrivileges(s,selectedProperty);
                    selectedProperty = this.returnSelectedPropertyWithCustomerContractDetails(s,selectedProperty);
                    selectedProperty.companyCode = CommonUtil.getBMFSSSession(s).loggedInUser.companyCode;
                    CommonUtil.getBMFSSSession(s).selectedProperty = selectedProperty;

                }

            }).catch(e => {
                console.log(e)
                resolve(e);
            })
        });

        return selectedProperty;

    }


    private  returnSelectedPropertyWithCustomerContractDetails(s:any, selectedProperty:Property) :Property{
        LoggerUtil.info("START::PreLoginHelper::returnSelectedPropertyWithCustomerContractDetails()>>>>>>");
        let request = new GetCustomerContractRequest();
        request.strNONCAAMSTRBP = selectedProperty.customerDtls.relationshipId;
        request.strCAAMSTRBP = selectedProperty.commonAreaDtls.relationshipId;
        request.strCompanyCode = CommonUtil.getBMFSSSession(s).loggedInUser.companyCode;
        request.strLoggedInUserName =CommonUtil.getBMFSSSession(s).loggedInUser.userName;


        var p = new Promise((resolve, reject) => {

            this.preloginService.getCustomerContractDetails(request).then(u => {
                resolve(u);

                if(null != u && u.isDataAvilableForInput()){
                    //return s;
                    selectedProperty = this.getSelectedPropertyFromGetCustomerContractResponse(selectedProperty,u);
                }else{
                    selectedProperty = this.returnSelectedPropertyWithDefaultContractSettings(selectedProperty,cst.START_STOP_RESTRICTION_REASON);
                }
            }).catch(e => {
                console.log(e)
                resolve(e);
                LoggerUtil.error("PreLoginHelper:Error Occured while service call getCustomerContractDetails");
                return this.returnSelectedPropertyWithDefaultContractSettings(selectedProperty,cst.START_STOP_RESTRICTION_REASON_ERR);
            })


        });

		LoggerUtil.info("END::PreLoginHelper::returnSelectedPropertyWithCustomerContractDetails()<<<<<<<");
		return selectedProperty;
    }




    private  returnSelectedPropertyWithDefaultContractSettings( selectedProperty:Property, restrictionReason:string):Property{
    		LoggerUtil.info("START::PreLoginHelper::returnSelectedPropertyWithDefaultContractSettings()>>>>>>");
    		selectedProperty.startEnabled = (false);
    		selectedProperty.stopEnabled = (false);
    		selectedProperty.startRestrictionReason = (restrictionReason);
    		selectedProperty.stopRestrictionReason = (restrictionReason);
    		LoggerUtil.info("END::PreLoginHelper::returnSelectedPropertyWithDefaultContractSettings()<<<<<<<");
		    return selectedProperty;
	  }

    private  returnSelectedPropertyWithAccessPrivileges(s:any,selectedProperty:Property) :Property{
        LoggerUtil.info("START::PreLoginHelper::returnSelectedPropertyWithsAccessPrivileges()>>>>>>");
        let request = new AccessPrivilegesRequest();
        request.strRelationshipId = CommonUtil.substringBefore(selectedProperty.relationshipId, ":");
        request.strLoggedInUserName =CommonUtil.getBMFSSSession(s).loggedInUser.userName;
        request.strCompanyCode = CommonUtil.getBMFSSSession(s).loggedInUser.companyCode;
        request.strPortal = cst.USERTYPE_SP_EXTERNAL_PORTAL;

        var p = new Promise((resolve, reject) => {

            this.preloginService.getAccessPrivForProperty(request).then(r => {
                resolve(r);

                if(null != r && r.isDataAvilableForInput()){
                    //return s;
                selectedProperty = this.returnPropertyWithAccessPrivFromResponse(selectedProperty,r);
                }
            }).catch(e => {
                console.log(e)
                resolve(e);
                LoggerUtil.error("ERROR OCCURED WHILE GETTING THE ACCESS PRIVILEGES::::");
                return selectedProperty;
            })


        });
        LoggerUtil.info("END::PreLoginHelper::returnSelectedPropertyWithsAccessPrivileges()<<<<<<<");
        return selectedProperty;

    }

    private returnPropertyWithAccessPrivFromResponse( selectedProperty:Property, response:any):Property{

        LoggerUtil.info("START::PreLoginHelper::returnPropertyWithAccessPrivFromResponse()>>>>>>");
    		selectedProperty.startEnabled = CommonUtil.equalsIgnoreCase(response.getStartServiceAccess(), cst.YES);
    		selectedProperty.stopEnabled=(CommonUtil.equalsIgnoreCase(response.getStopServiceAccess(), cst.YES));
    		selectedProperty.billingEnabled=(CommonUtil.equalsIgnoreCase(response.getBillingAccess(), cst.YES));
    		selectedProperty.startRestrictionReason=(response.getStartRestrictionReason());
    		selectedProperty.stopRestrictionReason=(response.getStopRestrictionReason());
    		selectedProperty.billingRestrictionReason=(response.getBillingRestrictionReason());
    		LoggerUtil.info("END::PreLoginHelper::returnPropertyWithAccessPrivFromResponse()<<<<<<<");
		    return selectedProperty;
      }


    private returnSelectedPropertyWithCustomerDtlsFromResponse(response:BPHierarchyDtlsResponse, selectedProperty:Property):Property{

        LoggerUtil.info("START::PreLoginHelper::returnSelectedPropertyWithCustomerDtlsFromResponse()>>>>>>");
    		selectedProperty.masterBPName=(response.strMasterBP);
    		selectedProperty.masterBP=(response.strMasterBP);
        let hierarchyDtlList = new Array<HierarchyDtlsDO>();
        hierarchyDtlList = response.hierarchyDtlsList;
        hierarchyDtlList.forEach(hierarchy => {
            if(CommonUtil.equalsIgnoreCase(CommonUtil.substringBefore(selectedProperty.MSTRCAARelationshipId, ":"), hierarchy.parentBP)){
              selectedProperty = this.returnSelectedPropertyWithCommonAreaDtls(hierarchy,selectedProperty);
            }else if(CommonUtil.equalsIgnoreCase(CommonUtil.substringBefore(selectedProperty.MSTRRelationshipId, ":"), hierarchy.parentBP)){
              selectedProperty = this.returnSelectedPropertyWithNONCommonAreaDtls(hierarchy,selectedProperty);
            }
        })
        LoggerUtil.info("END::PreLoginHelper::returnSelectedPropertyWithCustomerDtlsFromResponse()<<<<<<<");
		    return selectedProperty;
    }

    private returnSelectedPropertyWithCommonAreaDtls( hierDO:HierarchyDtlsDO, selectedProperty:Property):Property{

        LoggerUtil.info("START::PreLoginHelper::returnSelectedPropertyWithCommonAreaDtls()>>>>>>");
    		let custDtls = new CustomerDetails();
    		custDtls.contactAddress = (CommonUtil.mapAddressFromServiceLayerToAddressInFE(hierDO.billingAddress));
    		custDtls.relationshipId=hierDO.bpNumber;
    		custDtls.bpNumber=hierDO.bpNumber;
    		custDtls.customerName=hierDO.bpName;
    		custDtls.customerType=cst.ACCOUNT_CTGY_CAA;
    		custDtls.mailingAddress=(CommonUtil.mapAddressFromServiceLayerToAddressInFE(hierDO.mailingAddress));
    		custDtls.phoneNum=CommonUtil.isNotBlank(hierDO.primaryContactPhone)?CommonUtil.getFormatedPhonenumber(hierDO.primaryContactPhone):cst.NOT_PROVIDED;
    		custDtls.correspondenceLang=CommonUtil.isNotBlank(hierDO.language)?hierDO.language:"English";
    		custDtls.CAAFlag=(true);
    		selectedProperty.commonAreaDtls = (custDtls);
    		LoggerUtil.info("End::PreLoginHelper::returnSelectedPropertyWithCommonAreaDtls()>>>>>>");
    		return selectedProperty;
    }

    private returnSelectedPropertyWithNONCommonAreaDtls( hierDO:HierarchyDtlsDO, selectedProperty:Property):Property{

        LoggerUtil.info("START::PreLoginHelper::returnSelectedPropertyWithNONCommonAreaDtls()>>>>>>");
    		let custDtls = new CustomerDetails();
    		custDtls.contactAddress= CommonUtil.mapAddressFromServiceLayerToAddressInFE(hierDO.billingAddress);
    		custDtls.relationshipId=hierDO.bpNumber;
    		custDtls.bpNumber=hierDO.bpNumber;
    		custDtls.customerName=hierDO.bpName;
    		custDtls.customerType = (CommonUtil.substringAfter(selectedProperty.MSTRRelationshipId, "!"));
    		custDtls.correspondenceLang=CommonUtil.isNotBlank(hierDO.language)?hierDO.language:"English";
    		custDtls.bpType=(custDtls.customerType);
    		selectedProperty.propertyType=(CommonUtil.equalsIgnoreCase(custDtls.customerType, cst.ACCOUNT_CTGY_SITE)?cst.CUSTOMERTYPE_HB:cst.CUSTOMERTYPE_PM);
    		custDtls.mailingAddress=(CommonUtil.mapAddressFromServiceLayerToAddressInFE(hierDO.mailingAddress));
    		custDtls.phoneNum=CommonUtil.isNotBlank(hierDO.primaryContactPhone)?CommonUtil.getFormatedPhonenumber(hierDO.primaryContactPhone):cst.NOT_PROVIDED;
    		custDtls.NONCAAFlag=true;
    		selectedProperty.customerDtls=(custDtls);
    		LoggerUtil.info("End::PreLoginHelper::returnSelectedPropertyWithNONCommonAreaDtls()>>>>>>");
    		return selectedProperty;
	}


    private returnSelectedPropertyFromSession(strNodeGuidList:string[],selectedProperty:Property, relationshipId:string, s:any):Property{

        let bpDtlsList = CommonUtil.getBMFSSSession(s).bpDtlsList;
        bpDtlsList.forEach(mngBP => {
            mngBP.regionList.forEach(rgn => {
                rgn.propertyList.forEach(prop => {
                  if(CommonUtil.equalsIgnoreCase(relationshipId,prop.relationshipId)){
                    selectedProperty = prop;
                    strNodeGuidList.push(CommonUtil.substringBefore(prop.MSTRRelationshipId, ":"));
                    strNodeGuidList.push(CommonUtil.substringBefore(prop.MSTRCAARelationshipId,":"));
                  }
                })
            })
        })
        return selectedProperty;
    }


   private searchBPNumberInSessionAndReturnBPHierarchyDetails(bpNumber:string, accountType:string, s:any):HierarchyDetails {

        var accDtls = new HierarchyDetails();
        LoggerUtil.info("SEARCHING FOR THE BP NUMBER::::::"+bpNumber+":::AND ACCOUNT TYPE:::::"+accountType);
        if(null != CommonUtil.getBMFSSSession(s) && null != CommonUtil.getBMFSSSession(s).bpDtlsList){
          accDtls.isBroker = CommonUtil.getBMFSSSession(s).hierarchyDtls.isBroker;

          let bpDtlsList = CommonUtil.getBMFSSSession(s).bpDtlsList;
          bpDtlsList.forEach(mngBP => {
            if(CommonUtil.equalsIgnoreCase(accountType, cst.SEARCH_TYPE_MANAGEMENT)){
                if(CommonUtil.equalsIgnoreCase(mngBP.bpNumber, bpNumber)){
                    LoggerUtil.info("FOUND BP NUMBER IN MANAGEMNT LIST::::RETURNING REGION LIST FOR THAT MANAGEMENT BP:::"+bpNumber);
                    accDtls.regionList = (mngBP.regionList);
                }
            }else if(CommonUtil.equalsIgnoreCase(accountType, cst.SEARCH_TYPE_REGION)){
                for(let rgnbp of mngBP.regionList){
                    if(CommonUtil.equalsIgnoreCase(bpNumber, rgnbp.bpNumber)){
                        LoggerUtil.info("FOUND BP NUMBER IN REGION LIST::::RETURNING PROPERTY LIST FOR THAT REGION BP:::"+bpNumber);
                        accDtls.propertyList = rgnbp.propertyList;
                    }
                }
            }
          });
        }
        return accDtls;
   }


   private getBPHierarchyCall(bpList:Array<string>, callType:string, taxId:string, t:any):Promise<any> {

        LoggerUtil.info("Start::PreloginHelper::getBPHierarchyCall()>>>>>>") ;
        let bpHierReq = new BPHierarchyRequest();
            if(CommonUtil.isNotBlank(taxId)){
                var federalTaxIdList = new Array<string>();
                if(taxId.search(/-/) != -1){
                    federalTaxIdList.push(taxId.replace(/-/,""))   ;
                }
                federalTaxIdList.push(taxId);
                LoggerUtil.info("FEDERAL TAX ID LIST FOR THE BP HIERARCHY READ CALL::::::"+federalTaxIdList);
                callType = cst.HIERARCHY_CALL_TYPE_TAX_ID;
                bpHierReq.federalTaxIdList = federalTaxIdList;
            }else{
                bpHierReq.bpNumberList = bpList;
            }
        bpHierReq.callType =callType;
        bpHierReq.strCompanyCode= CommonUtil.getBMFSSSession(t).loggedInUser.companyCode;
        bpHierReq.strPortal =cst.USERTYPE_SP_EXTERNAL_PORTAL;
        bpHierReq.strLoggedInUserName = CommonUtil.getBMFSSSession(t).loggedInUser.userName;

        var p = new Promise((resolve, reject) => {
            this.preloginService.getBPHierarchy(bpHierReq).then(s => {
                resolve(s);
            }).catch(e => {
                console.log(e)
                resolve(e);
            })
        });
        LoggerUtil.info("End::PreloginHelper::getBPHierarchyCall()>>>>>>");
        return p;
   }


   public isinternalUserSearchingOnLoginScreen(searchPage:string, s:any): boolean {

        LoggerUtil.info("Start::PreloginHelper::isinternalUserSearchingOnLoginScreen()>>>>>>")
        var isInternalUserSearching = false;
        if(!this.loginWithAssociatedBps(CommonUtil.getBMFSSSession(s).loggedInUser) &&
        !(CommonUtil.equalsIgnoreCase(searchPage,"R") || CommonUtil.equalsIgnoreCase(searchPage,"P"))){
            isInternalUserSearching = true;
        }
        LoggerUtil.info("END::PreloginHelper::isinternalUserSearchingOnLoginScreen()>>>>>>");
        return isInternalUserSearching;
    }

    public loginWithAssociatedBps(s:any): boolean {

        if((CommonUtil.equalsIgnoreCase(s.user.getWebSecurityRole(),cst.USERTYPE_SP_INT_ADMIN))
        || (CommonUtil.equalsIgnoreCase(s.user.getWebSecurityRole(),cst.USERTYPE_SP_INT_AGT_OPREP))
        || (CommonUtil.equalsIgnoreCase(s.user.getWebSecurityRole(),cst.USERTYPE_SP_INT_READ_ONLY)))
        {
            return false;
        }else{
            return true;
        }

    }

    public updateSearchStringAndSearchTypeInSession(searchString:string,searchType:string,s:any){

        LoggerUtil.info("START::PreloginHelper::updateSearchStringAndSearchTypeInSession()>>>>>>");
        CommonUtil.getBMFSSSession(s).searchString = (CommonUtil.isNotBlank(searchString))?searchString.trim():"";
        CommonUtil.getBMFSSSession(s).searchType = (CommonUtil.isNotBlank(searchType))?searchType.trim():"";
        LoggerUtil.info("END::PreloginHelper::updateSearchStringAndSearchTypeInSession()>>>>>>");
    }
*/

      private getHierarchyDetailsForInternalUsersForNonBroker(managementBPList: ManagementBP[], bpList: string[]): HierarchyDetails {

          let mngmtList = new Array<ManagementBP>();
          let regionList = new Array<Region>();
          let propertyList = new Array<Property>();
          let hierarchyDtls = new HierarchyDetails();
          try{
              managementBPList.forEach(mngBP => {
                   if(CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(mngBP.bpNumber, ":")) || CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(mngBP.brokerBPNumber, ":"))){
                     hierarchyDtls.mngBP = true;
                     mngmtList.push(mngBP);
                   }
                   mngBP.regionList.forEach(rgn => {
                       if(CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(rgn.bpNumber, ":")) || CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(rgn.brokerBPNumber, ":"))){
                           hierarchyDtls.regionBP = true;
                           regionList.push(rgn);
                       }
                       rgn.propertyList.forEach(prop => {
                           console.log(CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(prop.relationshipId, ":")))
                           if(CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(prop.relationshipId, ":")) || CommonUtil.isArrayContains(bpList,CommonUtil.substringBefore(prop.brokerBPNumber, ":"))){
                               hierarchyDtls.propertyBP = true;
                               propertyList.push(prop);
                           }
                       });
                     });
                   });
                  LoggerUtil.info("THE MANAGEMENT LIST:::::::::"+mngmtList.length);
                  LoggerUtil.info("THE REGION LIST:::::::::"+regionList.length);
                  LoggerUtil.info("THE PROPERTY LIST:::::::::"+propertyList.length);
                  hierarchyDtls.mngBPList = mngmtList;
                  hierarchyDtls.regionList = regionList;
                  hierarchyDtls.propertyList = propertyList;
              }catch(err){
                  LoggerUtil.info("ERROR getHierarchyDetailsForInternalUsersForNonBroker=================>"+err.message)
              }
            return hierarchyDtls;
        }

        private getHierarchyDetailsFromManagementList(managementBPList: ManagementBP[], bpList: string[],callType:string, user:User): HierarchyDetails {

              let hierarchyDtls = new HierarchyDetails();
              try{
                  if(undefined != managementBPList && managementBPList.length > 0){
                        if(!CommonUtil.isUserHasAssociations(user.webSecurityRole) && !CommonUtil.equalsIgnoreCase(callType,cst.HIERARCHY_CALL_TYPE_TAX_ID)){

                        }else{
                            if(managementBPList.length > 0){
                                if(CommonUtil.isManagementListContainsDummyNodes(managementBPList)){
                                    hierarchyDtls.mngBP = CommonUtil.isManagementListContainsAtleastOneRealNode(managementBPList);
                                    hierarchyDtls.mngBPList = managementBPList;
                                    managementBPList.forEach(mng => {
                                        if(CommonUtil.isStringContains(mng.bpNumber, "NO_MGMT")){
                                            let rgnListWithNOMgmt = mng.regionList;
                                            hierarchyDtls.regionList = CommonUtil.returnRegionListWithRealNode(rgnListWithNOMgmt);
                                            hierarchyDtls.regionBP = hierarchyDtls.regionList.length > 0;
                                            hierarchyDtls.onlyProperty = CommonUtil.checkManagementListOrRegionListHasOnlyOneProperty(undefined,hierarchyDtls.regionList);
                                            rgnListWithNOMgmt.forEach(regn => {
                                                if(CommonUtil.isStringContains(regn.bpNumber, "NO_REGN")){
                                                    hierarchyDtls.propertyList = regn.propertyList;
                                                    hierarchyDtls.propertyBP = (hierarchyDtls.propertyList.length >0);
                                                    hierarchyDtls.onlyProperty = (hierarchyDtls.propertyList.length == 1);
                                                }
                                            });
                                        }
                                    })
                                }else{
                                    LoggerUtil.info("THIS USER HAS ALL MANAGEMENT NODES WITHOUT DUMMY NODES::::::::::");
                                    hierarchyDtls.mngBP = true;
                                    hierarchyDtls.mngBPList = managementBPList;
                                    hierarchyDtls.onlyProperty = CommonUtil.checkManagementListOrRegionListHasOnlyOneProperty(managementBPList,undefined);
                                }
                            }
                        }
                  }else{
                      LoggerUtil.info("NO HIERARCHY DETAILS FOUND FOR THE SEARCH CRIETERIA:::");
                      hierarchyDtls.mngBP = false;
                  }
              }catch(err){
                LoggerUtil.info("ERROR==getHierarchyDetailsFromManagementList=====>"+err.message)
              }
              return hierarchyDtls;
        }

}
