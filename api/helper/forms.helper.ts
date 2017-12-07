import LoggerUtil from './../logs/log';
import Promise = require('tspromise');
import { GetPromoCodeDetailsRequest } from './../request/mfstartservice.request';
import { GetFormFileDetailsForPromoCodeRequest } from '../request/getformfiledetailsforpromocoderequest';
import * as cst from './../util/constant';
import { CommonUtil } from './../util/common.util';
import { FormsService } from '../services/forms.services';
import { StartStopTxnService } from '../services/startstoptxn.service';
import { PromoCodeDO } from '../model/promocodedo';
import { Form } from '../model/form';
import {CommonUtilityHelper} from '../helper/commonutility.helper';
import * as _ from "lodash";

export class FormsHelper {

  private formsService: FormsService;
  private startStopService: StartStopTxnService;
  static readonly HB_DEFAULT_PC_VALUE = "GMEHB0000";
	static readonly MF_DEFAULT_PC_VALUE = "GMEMF0000";
	static readonly MF_CSA_DEFAULT_PC_VALUE = "GMEMF0001";
	static readonly MF_NONCSA_DEFAULT_PC_VALUE = "GMEMF0002";

  constructor(){
      this.formsService = new FormsService();
      this.startStopService = new StartStopTxnService();
  }


    public getGMEForms(req: any): Promise<any> {

        LoggerUtil.info("Getting forms for the request::::"+JSON.stringify(req.body))
        let formsList = new Array<Form>();
        let inReq = new GetFormFileDetailsForPromoCodeRequest();
        inReq.promoCodeList = this.getPromocodeListForSelectedProperty(req);

        var p = new Promise((resolve, reject) => {
          this.formsService.getFormFileDetailsforPromocode(inReq).then(t => {
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
            });
        });
        return p;
    }


    public getPromocodeListForSelectedProperty(req:any):any{
        let promoCodeReq  = new GetPromoCodeDetailsRequest();
        let promoCodeArr = new Array<string>();
        promoCodeReq.strCompanyCode =cst.GMESS_CC_0270;
        promoCodeReq.strLoggedInUserName = CommonUtil.getBMFSSSession(req).loggedInUser.userName;
        promoCodeReq.strPortal=cst.GMESS_PORTAL;
        promoCodeReq.strRelationshipId = CommonUtil.getBMFSSSession(req).selectedProperty.relationshipId;
        LoggerUtil.info("Realationship id = "+CommonUtil.getBMFSSSession(req).selectedProperty.relationshipId+" And User Name is =="+CommonUtil.getBMFSSSession(req).loggedInUser.userName);
          this.startStopService.getPromocodeDetails(promoCodeReq).then(t => {
                  if(null != t && null != t.serviceAreaPromoCodeList && t.serviceAreaPromoCodeList.length > 0){
                     t.serviceAreaPromoCodeList.forEach((promo: any) => {
                        promoCodeArr.push(promo.strPromoCode);
                      });
                  }else{
                    LoggerUtil.info("NO PROMO CODES FOUND FOR THE USER::::::::"+ CommonUtil.getBMFSSSession(req).loggedInUser.userName+":::AND RELATION SHIP ID:::"+CommonUtil.getBMFSSSession(req).selectedProperty.relationshipId);
                  }

          });
          promoCodeArr = this.getDefaultValuesBasedOnUserTypeAndBPType(promoCodeArr, req);
          return promoCodeArr;
    }

    public getPDFsForSelectedForm(req:any): Promise<any> {
      LoggerUtil.info("GETTING THE PDF FORM FOR THE PID::::::::"+req.body.pid);
        var p = new Promise((resolve, reject) => {
           this.formsService.getPDFForm(req.body.pid).then(t => {
            resolve(t);
           });

        });

       return p;
    }

    private getDefaultValuesBasedOnUserTypeAndBPType(promoCodeList:Array<string>, s:any):Array<string>{
		let commonUtilityHelper = new CommonUtilityHelper();
		if(commonUtilityHelper.isBuilder(s)){
			promoCodeList.push(FormsHelper.HB_DEFAULT_PC_VALUE);
		}else{
			promoCodeList.push(FormsHelper.MF_DEFAULT_PC_VALUE);
			let bpType:string  = commonUtilityHelper.getSelectedPropertyBPType(s);
			if (CommonUtil.isNotBlank(bpType)){
				if(_.isEqual(cst.ACCOUNT_CTGY_CSA,bpType)){
					promoCodeList.push(FormsHelper.MF_CSA_DEFAULT_PC_VALUE);
        }else if(_.isEqual(cst.ACCOUNT_CTGY_NCSA,bpType)){
	            	promoCodeList.push(FormsHelper.MF_NONCSA_DEFAULT_PC_VALUE);
	            }
			}
		}
		LoggerUtil.info("ADDED DEFAULT VALUES TO THE PROMO CODE LIST BASED ON USER TYPE AND BP TYPE::::::::::"+promoCodeList);
		return promoCodeList;
	}


}
