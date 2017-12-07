import LoggerUtil from './../logs/log';
import Promise = require('tspromise');
import { Unit, ESIID } from './../model/bmfss.session';
import {CommonUtilityHelper} from '../helper/commonutility.helper';
import { ServiceAddressForStartStopRequest } from './../request/serviceaddressforstartstop.request';
import {MFStopServiceRequest} from './../request/mfstopservice.request';
import {EmailHelper} from './email.helper';
import { StartStopTxnService } from '../services/startstoptxn.service';
import { CommonUtil } from './../util/common.util';
import * as cst from './../util/constant';
import { MFPropertyAddress } from './../model/bmfss.session';

export class StopServiceHelper {

      private startStopService: StartStopTxnService;
      private commonUtilityHelper: CommonUtilityHelper;

      constructor(){
          this.startStopService = new StartStopTxnService();
          this.commonUtilityHelper = new CommonUtilityHelper();
      }

    public listPropertyAddress(req: any): Promise<any> {

         return new Promise((resolve, reject) => {
            let addrList = new Array<MFPropertyAddress>();
            for(var i=0; i<5; i++){
                let addr = new MFPropertyAddress();
                addr.streetAddress = "120"+i+" Fannin st";
                addr.city = "Houston";
                addr.zipcode = "7700"+i;
                addr.unitList = this.getUnitList(i);
                addrList.push(addr);
            }
            resolve(addrList)
         })
    }

    private getUnitList(i: number) {

        let unitList = new Array<Unit>();
        for(var j=0; j<10; j++){
            let unit = new Unit();
            unit.strUnitNumber = "10"+j+i;
            unit.esiid = "0000000000"+j+234111+i;
            unit.unitID = (i+j).toString();
            unitList.push(unit);
        }
        return unitList;
    }

    public stopServiceSubmit(req:any) :Promise<any>{
      LoggerUtil.info("START MFStartStopHelper submitStopRequest()>>>>>>>");
      let commonUtilityHelper = new CommonUtilityHelper();
      let emailHelper = new EmailHelper();
      let selectedUnit:Unit[] = req.body.selectedUnits;
       let selectPropAddress: string =   selectedUnit[0].strStreetNum +" "+ selectedUnit[0].strStreetName;
      var p = new Promise((resolve, reject) =>{
        let request = this.populateStopServiceRequest(req, selectedUnit);
          this.startStopService.updateMFStopService(request).then(s => {
              if (undefined != s && (null != s.transactionId || ""!= s.transactionId)) {
                //this.commonUtilityHelper.updateSessionWithSubmittedTxnDetails(selectedUnit, selectPropAddress,req);
                resolve({submittedOn:s.transactionDatetime, transactionId:s.transactionId})
                let propCity =  selectedUnit[0].strCity;
                let propZipcode = selectedUnit[0].strZipcode;
                emailHelper.sendMFStopServiceEmail(selectedUnit,s.transactionId, s.transactionDatetime,selectPropAddress,propCity,propZipcode,req);
              }else{
                LoggerUtil.error("Error Adding MF Stop Service request to the DB");
                resolve({error:true,errmsg:"Error Adding MF Stop Service request to the DB"});
              }
           });
        });
          LoggerUtil.info("END MFStartStopHelper submitStopRequest()>>>>>>>");
      return p;

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
           request.bpStreetNumber = req.body.businessInfo.addr.streetNum;
           request.bpStreetName= req.body.businessInfo.addr.streetName;
           request.bpCity = req.body.businessInfo.addr.city;
           request.bpState = req.body.businessInfo.addr.city;
           request.bpPoBox = req.body.businessInfo.addr.POBox;
           request.bpZipCode = req.body.businessInfo.addr.zipcode;
           request.bpBusinessName = req.body.selectedpropName;
           request.relationshipId = req.body.relationshipId;
           LoggerUtil.info("concatBpNumber = "+concatBpNumber);
           request.bpNumber = (concatBpNumber);//: separated value
           request.unitNumber =(concatUnitNum);//: separated value
           request.esiId = (concatEsiid);//: separated value
           request.federalTaxId =  req.body.businessInfo.fedTaxId;
           request.correspondenceLanguagePref = req.body.businessInfo.languagePref;
           request.state = (concatState);//: separated value
           request.city = (concatCity);//: separated value
           request.streetName = (concatStretName);//: separated value
           request.streetNumber = (concatStreetNum);//: separated value
           request.zipCode = (concatZipCode);//: separated value
           request.priorityMoveflag = (priorityMoveInFlagColsv);//: separated value
           request.strPortal = (cst.GMESS_PORTAL);
          // request.relationshipId = (commonUtilityHelper.getMSTRNONCAABPNumberForStartStopTxn(req));

      }catch(e){
        LoggerUtil.info("Error while populating the request params for Stop Service Submit::"+e.message);
      }
   return request;

   }


  /*  public stopServiceSubmit(req: any): Promise<any> {

        return new Promise((resolve, reject) => {
            resolve({submittedOn:"March 10,2017 at 04:17 p.m, Central", transactionId:"0000000000"})
        });
    }*/
}
