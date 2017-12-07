import LoggerUtil from './../logs/log';
import Promise = require('tspromise');
import * as cst from './../util/constant';
import { CommonUtil } from './../util/common.util';
import { StartStopTxnService } from '../services/startstoptxn.service';
import { PromoCodeDO } from '../model/promocodedo';
import {CommonUtilityHelper} from '../helper/commonutility.helper';
import {Unit, ESIID} from './../model/bmfss.session';
import {MFPropertyAddress} from './../model/bmfss.session';
import { ServiceAddressForStartStopRequest } from './../request/serviceaddressforstartstop.request';
import {MFStopServiceRequest} from './../request/mfstopservice.request';
import {MFStartServiceRequest} from './../request/mfstartservice.request';
import {EmailHelper} from './email.helper';
import {ESIIDBPNumberDO} from './../model/esiidbpnumberdo';
import {PropertyAddressDO} from './../model/propertyaddressdo';
import {Esiiddo} from './../model/esiiddo';
import * as _ from "lodash";


export class MFStartStopHelper {

  private startStoptxnService: StartStopTxnService;
  private startStopService: StartStopTxnService;
  static readonly HB_DEFAULT_PC_VALUE = "GMEHB0000";
	static readonly MF_DEFAULT_PC_VALUE = "GMEMF0000";
	static readonly MF_CSA_DEFAULT_PC_VALUE = "GMEMF0001";
	static readonly MF_NONCSA_DEFAULT_PC_VALUE = "GMEMF0002";

  constructor(){

      this.startStopService = new StartStopTxnService();
  }


    public getUnavialbleDatesForUnitList(req: any, unitList:Array<Unit>): Array<Unit>{
        LoggerUtil.info("getUnavialbleDatesForUnitList for the request::::"+JSON.stringify(req.body));
        let commonUtilityHelper = new CommonUtilityHelper();
        if(null != unitList && undefined != unitList && unitList.length >0 ){

  				let unavailableDates:string = commonUtilityHelper.getUnavailableDates(unitList[0].esiid);
          unitList.forEach((unit: Unit) =>{
  		       unit.unAvailableDates =(unavailableDates);
  				});

  		}else{

  				LoggerUtil.error("MFStartStopHelper::getUnitListBasedOnServiceType():::no unavailable dates found");

      }
		  return unitList;

    }

    public  getServiceAddressForMF(serviceType:string, req:any):Promise<any>{

  		LoggerUtil.info("START::MFStartStopHelper::getServiceAddressForMF()>>>>>>");
      let mfPropertyAddrssList = new  Array<MFPropertyAddress>();
      let request:ServiceAddressForStartStopRequest = this.populateServiceAddressStartStop(req);
      var p = new Promise((resolve, reject) => {
        this.startStopService.getServiceAddressForStartStopTxn(request).then(s => {

                    mfPropertyAddrssList= this.returnServiceAddressForMF(s,req);
      	  	 });
             resolve(mfPropertyAddrssList);
           });
		 LoggerUtil.info("SERVICE ADDRESS LIST FOR THIS PROPERTY:::::::"+mfPropertyAddrssList.length);
		 LoggerUtil.info("END::MFStartStopHelper::getServiceAddressForMF()>>>>>>");
		    return p;
     }

     private returnServiceAddressForMF(s:any,req:any): Array<MFPropertyAddress>{
      let mfPropertyAddrssList = new  Array<MFPropertyAddress>();
      let propertyAddressList = new Array<PropertyAddressDO>();
      try{
       if(null != s && s.dataAvilableForInput){
            propertyAddressList = s.getPropertyAddrList();
            propertyAddressList.forEach( (propertyAddressDO:PropertyAddressDO) => {
              let propertyAddress = new MFPropertyAddress();
              propertyAddress.streetAddress= (propertyAddressDO.strStreetAdress);
              propertyAddress.city= (propertyAddressDO.strCity);
              propertyAddress.state = (propertyAddressDO.strState);
              propertyAddress.zipcode = (propertyAddressDO.strZipcode);
               let esidDOList = propertyAddressDO.unitList;
               let unitListArr = new Array<Unit>();

               esidDOList.forEach((esiiddo:Esiiddo)=> {
                  let unit = new Unit();
                  unit.esiid = (esiiddo.esiid);
                  unit.priorityMoveInEnabled = (esiiddo.priorityMoveinEnabled);
                  unit.priorityMoveInFee = (esiiddo.priorityMoveinFee);
                  unit.strStreetNum = (esiiddo.streetNum);
                  unit.strStreetName = (esiiddo.streetName);
                  unit.strCity = (esiiddo.city);
                  unit.strState = (esiiddo.state);
                  unit.strUnitNumber = (esiiddo.unitNum);
                  unit.strZipcode = (esiiddo.zipcode);
                  unit.strMeterType = (esiiddo.meterType);
                  unit.strServiceArea = (esiiddo.serviceArea);
                  unit.pending = (esiiddo.esidPending);
                  unit.marketHold = (esiiddo.marketHold);
                  unit.bpNumber = (esiiddo.bpNumber);
                  unit.active=(esiiddo.esidActive);
                  unitListArr.push(unit);
                });
              unitListArr = this.mergeTCSResultWithCCSDetailsPendingStatus(unitListArr,req);
              propertyAddress.unitList = (unitListArr);
              mfPropertyAddrssList.push(propertyAddress);
            });

          }

         } catch(e){
              LoggerUtil.error("Error while getting the response in returnServiceAddressForMF()::::" +e.message);
         }
         return mfPropertyAddrssList;
     }

     private  mergeTCSResultWithCCSDetailsPendingStatus(unitList:Array<Unit>, req:any):Array<Unit>{
		 let esiidList = CommonUtil.getBMFSSSession(req).selectedProperty.ESIIDDetails.CCSNONCAAESIIDList;
		 esiidList.forEach((ESIID:ESIID) => {
			unitList.forEach((unit:Unit) =>{
				if(CommonUtil.equalsIgnoreCase(unit.esiid, ESIID.esiid)){
					unit.startPendingStatusFromCCS = (ESIID.startPendingStatusFromCCS);
					unit.stopPendingStatusFromCCS= (ESIID.stopPendingStatusFromCCS);
				}
			});

		});
		return unitList;
	}

     private populateServiceAddressStartStop(req:any):ServiceAddressForStartStopRequest{
       let commonUtilityHelper = new CommonUtilityHelper();
       let request = new ServiceAddressForStartStopRequest();
       try{
         request.strCustomerType = "MFAM";
         request.strCompanycode = (cst.GMESS_CC_0270);
         commonUtilityHelper.getESIIDStrListForMultifamilyStartStopServiceAndVUM(req);
         let esiidBPList:Array<ESIIDBPNumberDO>  = commonUtilityHelper.createEsiidbpNumberDOForBuilderStopAndMFTxns(req);
         request.esiidBPDOList = esiidBPList;
         LoggerUtil.info("GETTING THE ESIID DETAILS FOR MF START STOP FOR ESIID LIST::::::"+esiidBPList.length);
      }catch(e){
        LoggerUtil.error("Error is setting the request in populateServiceAddressStartStop ::::::"+e);

      }

        return request;
     }

     public submitRequest(serviceType:string,  selectPropAddress:string, req:any):Promise<any>{
    		LoggerUtil.info("START MFStartStopHelper submitRequest()>>>>>>>");
    		var p = new Promise((resolve, reject) =>{
          let selectedUnit:Array<Unit> = req.body.selectedUnits;
     		 if(CommonUtil.isNotBlank(serviceType) && CommonUtil.equalsIgnoreCase(serviceType, "STOP")){
     			 p = this.submitStopRequest(selectedUnit, selectPropAddress, req);
     		 }else{
     			 p = this.submitStartRequest(selectedUnit, selectPropAddress, req);
     		 }
         resolve(p);
    		});
    		LoggerUtil.info("END MFStartStopHelper submitRequest()>>>>>>>");
    		return p;
	  }

    private submitStartRequest(selectedUnit:Array<Unit>, selectPropAddress:string, req:any) :Promise<any>{
      LoggerUtil.info("START MFStartStopHelper submitStartRequest()>>>>>>>");

      var p = new Promise((resolve, reject) =>{
        let request = this.populateStartServiceRequest(req, selectedUnit);
        let emailHelper = new EmailHelper();
    	 		this.startStopService.updateMFStartService(request).then(s => {
        	 		if (undefined != s && (null != s.transactionId || ""!= s.transactionId)) {
        	 			this.updateSessionWithSubmittedTxnDetails(selectedUnit, selectPropAddress,req);
                resolve({error:false,transactionNumber:s.transactionId,transDateAndTime:s.transactionDateTime});
        		 		let propCity = req.body.selectPropCity;
        		 		let propZipcode = req.body.selectPropZipCode;
        	 			emailHelper.sendMFStartServiceEmail(selectedUnit,s.transactionId, s.transactionDatetime,selectPropAddress,propCity,propZipcode,req);
        	 		}else{
                LoggerUtil.error("Error Adding MF Start Service request to the DB");
        	 			resolve({error:true,errmsg:"Error Adding MF Start Service request to the DB"});
        	 		}
           });
        });
    	 		LoggerUtil.info("END MFStartStopHelper submitStartRequest()>>>>>>>");
	 		return p;

	 }

   private submitStopRequest(selectedUnit:Array<Unit>, selectPropAddress:string, req:any) :Promise<any>{
     LoggerUtil.info("START MFStartStopHelper submitStopRequest()>>>>>>>");
     let emailHelper = new EmailHelper();
     var p = new Promise((resolve, reject) =>{
       let request = this.populateStopServiceRequest(req, selectedUnit);
         this.startStopService.updateMFStopService(request).then(s => {
             if (undefined != s && (null != s.transactionId || ""!= s.transactionId)) {
               this.updateSessionWithSubmittedTxnDetails(selectedUnit, selectPropAddress,req);
               resolve({error:false,transactionNumber:s.transactionId,transDateAndTime:s.transactionDateTime});
               let propCity = req.body.selectPropCity;
               let propZipcode = req.body.selectPropZipCode;
               emailHelper.sendMFStopServiceEmail(selectedUnit,s.tansactionId, s.transactionDatetime,selectPropAddress,propCity,propZipcode,req);
             }else{
               LoggerUtil.error("Error Adding MF Stop Service request to the DB");
               resolve({error:true,errmsg:"Error Adding MF Stop Service request to the DB"});
             }
          });
       });
         LoggerUtil.info("END MFStartStopHelper submitStopRequest()>>>>>>>");
     return p;

  }

   private updateSessionWithSubmittedTxnDetails(selectedUnit:Array<Unit>,  selectPropAddress:string, req:any){
   try{
     if(null != CommonUtil.getBMFSSSession(req) && null != CommonUtil.getBMFSSSession(req).selectedProperty.mfPropertyAddrList && CommonUtil.getBMFSSSession(req).selectedProperty.mfPropertyAddrList.length >0){
       CommonUtil.getBMFSSSession(req).selectedProperty.mfPropertyAddrList.forEach((propertyAddress:MFPropertyAddress) =>{
         if(CommonUtil.equalsIgnoreCase(selectPropAddress, propertyAddress.streetAddress)){
          propertyAddress.unitList.forEach((unit:Unit) => {
            selectedUnit.forEach((selUnit:Unit) =>{
               if(CommonUtil.equalsIgnoreCase(selUnit.strUnitNumber,unit.strUnitNumber)){
                 unit.pending = (true);
               }
             });
           });
         }
       });
     }
   }catch(e){
     LoggerUtil.info("Error in updateSessionWithSubmittedTxnDetails :::"+e.message);
   }

  }


    private populateStartServiceRequest(req:any, selectedUnit:Array<Unit>):MFStartServiceRequest{
      let request = new MFStartServiceRequest();
      let commonUtilityHelper = new CommonUtilityHelper();
      let totalNum :string;
      let concatEsiid:string = "";
      let concatEffectiveDate:string = "";
      let priorityMoveInFlagColsv:string = "";
      let concatUnitNum:string = "";
      let concatStreetNum:string = "";
      let concatStretName:string = "";
      let concatCity:string = "";
      let concatState:string = "";
      let concatZipCode:string = "";
      let concatBpNumber:string = "";
      try{

        selectedUnit.forEach((unit:Unit) =>{

         concatEsiid += unit.esiid + cst.EXCLAIMATIONSEPARATOR;
         concatEffectiveDate += unit.effectiveDate + cst.COLON;
         priorityMoveInFlagColsv += (unit.priorityDateSelected?"Y":"N")+cst.COLON;
         concatUnitNum += unit.strUnitNumber + cst.EXCLAIMATIONSEPARATOR;
         concatBpNumber += unit.bpNumber + cst.EXCLAIMATIONSEPARATOR;
         concatStreetNum += unit.strStreetNum + cst.EXCLAIMATIONSEPARATOR;
         concatStretName += unit.strStreetName + cst.EXCLAIMATIONSEPARATOR;
         concatCity += unit.strCity + cst.EXCLAIMATIONSEPARATOR;
         concatState += unit.strState + cst.EXCLAIMATIONSEPARATOR;
         concatZipCode += unit.strZipcode + cst.EXCLAIMATIONSEPARATOR;
       });
       concatEsiid = cst.EXCLAIMATIONSEPARATOR + concatEsiid;
       concatEffectiveDate = cst.COLON + concatEffectiveDate;
       priorityMoveInFlagColsv = cst.COLON + priorityMoveInFlagColsv;
       concatUnitNum = cst.EXCLAIMATIONSEPARATOR + concatUnitNum;
       concatBpNumber = cst.EXCLAIMATIONSEPARATOR + concatBpNumber;
       concatStreetNum = cst.EXCLAIMATIONSEPARATOR + concatStreetNum;
       concatStretName = cst.EXCLAIMATIONSEPARATOR + concatStretName;
       concatCity = cst.EXCLAIMATIONSEPARATOR + concatCity;
       concatState = cst.EXCLAIMATIONSEPARATOR + concatState;
       concatZipCode = cst.EXCLAIMATIONSEPARATOR + concatZipCode;
       totalNum = (String)(selectedUnit.length);
            let strNodeGuidList = commonUtilityHelper.getNONCAAPropertyNodeGuidList(req);
            request.strNONCSANODEGUIDList = strNodeGuidList;
            request.strCompanyCode = (cst.GMESS_CC_0270);
            request.custServiceVerifyInd = ("Y");
            request.count = (totalNum);
            request.requestorUserId =(commonUtilityHelper.getLoggedInUserName(req));
            request.date = (concatEffectiveDate);//: separated value
            request.bpStreetNumber = (commonUtilityHelper.getMailingAddressStreetNum(req));
            request.bpStreetName= (commonUtilityHelper.getMailingAddressStreetName(req));
            request.bpCity = (commonUtilityHelper.getMailingAddressCity(req));
            request.bpState = (commonUtilityHelper.getMailingAddressState(req));
            request.bpPoBox = (commonUtilityHelper.getMailingAddressPoBox(req));
            request.bpZipCode = (commonUtilityHelper.getMailingAddressZipCode(req));
            request.bpBusinessName = (CommonUtil.getBMFSSSession(req).selectedProperty.bpName);
            LoggerUtil.info("concatBpNumber = "+concatBpNumber);
            request.bpNumber = (concatBpNumber);//: separated value
            request.unitNumber =(concatUnitNum);//: separated value
            request.esiId = (concatEsiid);//: separated value
            request.federalTaxId = (commonUtilityHelper.getTIN(req));
            request.correspondenceLanguagePref = (commonUtilityHelper.getLanguage(req));
            request.state = (concatState);//: separated value
            request.city = (concatCity);//: separated value
            request.streetName = (concatStretName);//: separated value
            request.streetNumber = (concatStreetNum);//: separated value
            request.zipCode = (concatZipCode);//: separated value
            request.priorityMoveflag = (priorityMoveInFlagColsv);//: separated value
            request.strPortal = (cst.GMESS_PORTAL);
            request.relationshipId = (commonUtilityHelper.getMSTRNONCAABPNumberForStartStopTxn(req));
       }catch(e){
         LoggerUtil.info("Error while populating the request params for Start Service Submit::"+e.message);
       }
    return request;

    }


    private populateStopServiceRequest(req:any, selectedUnit:Array<Unit>):MFStopServiceRequest{
      let request = new MFStopServiceRequest();
      let commonUtilityHelper = new CommonUtilityHelper();
      let totalNum :string;
      let concatEsiid:string = "";
      let concatEffectiveDate:string = "";
      let priorityMoveInFlagColsv:string = "";
      let concatUnitNum:string = "";
      let concatStreetNum:string = "";
      let concatStretName:string = "";
      let concatCity:string = "";
      let concatState:string = "";
      let concatZipCode:string = "";
      let concatBpNumber:string = "";
      try{

        selectedUnit.forEach((unit:Unit) =>{

         concatEsiid += unit.esiid + cst.EXCLAIMATIONSEPARATOR;
         concatEffectiveDate += unit.effectiveDate + cst.COLON;
         priorityMoveInFlagColsv += (unit.priorityDateSelected?"Y":"N")+cst.COLON;
         concatUnitNum += unit.strUnitNumber + cst.EXCLAIMATIONSEPARATOR;
         concatBpNumber += unit.bpNumber + cst.EXCLAIMATIONSEPARATOR;
         concatStreetNum += unit.strStreetNum + cst.EXCLAIMATIONSEPARATOR;
         concatStretName += unit.strStreetName + cst.EXCLAIMATIONSEPARATOR;
         concatCity += unit.strCity + cst.EXCLAIMATIONSEPARATOR;
         concatState += unit.strState + cst.EXCLAIMATIONSEPARATOR;
         concatZipCode += unit.strZipcode + cst.EXCLAIMATIONSEPARATOR;
       });
       concatEsiid = cst.EXCLAIMATIONSEPARATOR + concatEsiid;
       concatEffectiveDate = cst.COLON + concatEffectiveDate;
       priorityMoveInFlagColsv = cst.COLON + priorityMoveInFlagColsv;
       concatUnitNum = cst.EXCLAIMATIONSEPARATOR + concatUnitNum;
       concatBpNumber = cst.EXCLAIMATIONSEPARATOR + concatBpNumber;
       concatStreetNum = cst.EXCLAIMATIONSEPARATOR + concatStreetNum;
       concatStretName = cst.EXCLAIMATIONSEPARATOR + concatStretName;
       concatCity = cst.EXCLAIMATIONSEPARATOR + concatCity;
       concatState = cst.EXCLAIMATIONSEPARATOR + concatState;
       concatZipCode = cst.EXCLAIMATIONSEPARATOR + concatZipCode;
       totalNum = (String)(selectedUnit.length);
            let strNodeGuidList = commonUtilityHelper.getNONCAAPropertyNodeGuidList(req);
            request.strNONCSANODEGUIDList = strNodeGuidList;
            request.strCompanyCode = (cst.GMESS_CC_0270);
            request.custServiceVerifyInd = ("Y");
            request.count = (totalNum);
            request.requestorUserId =(commonUtilityHelper.getLoggedInUserName(req));
            request.date = (concatEffectiveDate);//: separated value
            request.bpStreetNumber = (commonUtilityHelper.getMailingAddressStreetNum(req));
            request.bpStreetName= (commonUtilityHelper.getMailingAddressStreetName(req));
            request.bpCity = (commonUtilityHelper.getMailingAddressCity(req));
            request.bpState = (commonUtilityHelper.getMailingAddressState(req));
            request.bpPoBox = (commonUtilityHelper.getMailingAddressPoBox(req));
            request.bpZipCode = (commonUtilityHelper.getMailingAddressZipCode(req));
            request.bpBusinessName = (CommonUtil.getBMFSSSession(req).selectedProperty.bpName);
            LoggerUtil.info("concatBpNumber = "+concatBpNumber);
            request.bpNumber = (concatBpNumber);//: separated value
            request.unitNumber =(concatUnitNum);//: separated value
            request.esiId = (concatEsiid);//: separated value
            request.federalTaxId = (commonUtilityHelper.getTIN(req));
            request.correspondenceLanguagePref = (commonUtilityHelper.getLanguage(req));
            request.state = (concatState);//: separated value
            request.city = (concatCity);//: separated value
            request.streetName = (concatStretName);//: separated value
            request.streetNumber = (concatStreetNum);//: separated value
            request.zipCode = (concatZipCode);//: separated value
            request.priorityMoveflag = (priorityMoveInFlagColsv);//: separated value
            request.strPortal = (cst.GMESS_PORTAL);
            request.relationshipId = (commonUtilityHelper.getMSTRNONCAABPNumberForStartStopTxn(req));
       }catch(e){
         LoggerUtil.info("Error while populating the request params for Stop Service Submit::"+e.message);
       }
    return request;

    }


    public getdummy(req: any): Promise<any>{
        LoggerUtil.info("Getting forms for the request::::"+JSON.stringify(req.body))
      /*  let formsList = new Array<Form>();
        let inReq = new GetFormFileDetailsForPromoCodeRequest();
        inReq.promoCodeList = this.getPromocodeListForSelectedProperty(req);
  */
        var p = new Promise((resolve, reject) => {
        /*  this.formsService.getFormFileDetailsforPromocode(inReq).then(t => {
                if(null != t && null != t.fileDetailsVOList && t.fileDetailsVOList.length > 0){
                  LoggerUtil.info("Forms found..."+  t.fileDetailsVOList.length);
                  t.fileDetailsVOList.forEach((fileDtl: any) => {
                    let form =  new Form();
                    form.displayName = fileDtl.displayname;
                    form.pid = String(fileDtl.pid);
                    LoggerUtil.info("File DisplayNAme is==" +fileDtl.displayname + "FILE PID is==" +fileDtl.pid);
                    formsList.push(form);
                  })

                }else{
                  LoggerUtil.info("No forms found...");
                }
                  resolve(formsList);
            });*/
        });
        return p;
    }

}
