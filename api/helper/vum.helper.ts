import LoggerUtil from './../logs/log';
import Promise = require('tspromise');
import { UserDtlsForRstPswdRequest } from '../request/profile.request';
import * as cst from './../util/constant';
import { CommonUtil } from './../util/common.util';
import { ProfileService } from '../services/profile.service';
import { DailyReport } from '../model/vum.model'
import { CommonUtilityHelper } from '../helper/commonutility.helper'
import{ VumDailyReportRequest } from './../request/vumdailyreportlist.request';
import { VUMService } from '../services/vum.service';
import * as _ from "lodash";


export class VUMHelper {

    private profileService: ProfileService;
    private commonUtilityHelper: CommonUtilityHelper;
    private vumService: VUMService;

    constructor(){
        this.profileService = new ProfileService();
        this.commonUtilityHelper = new CommonUtilityHelper();
        this.vumService = new VUMService();
    }


    public getVUMDailyReportList(req:any):Promise<any>{
        LoggerUtil.info("START::MFVUMHelper::getVUMDailyReportList()>>>>>>");
        let request:VumDailyReportRequest = this.populateVumDailyReportRequest(req);
        var p = new Promise((resolve, reject) => {
          this.vumService.getVUEDailyReportList(request).then(s => {
              resolve(this.populateVUMDailyReportList(s,req.body.reportDate))
          });
        });
        LoggerUtil.info("END::MFVUMHelper::updateEmailPreference()<<<<<");
        return p;

  }

      private populateVUMDailyReportList(s:any,dailyReportDate: string): DailyReport[]{
          LoggerUtil.info("START::MFVUMHelper::getVUMDailyReportListFromResponse()>>>>>>");
          let dailyReportList = new Array<DailyReport>();
          if(undefined != s.vumDailyReportDOList && s.vumDailyReportDOList.length >0 && CommonUtil.isNotBlank(s.vumDailyReportDOList[0].consecutiveDays)){
            s.vumDailyReportDOList.forEach((vumDO:any) => {
                let report = new DailyReport();
                report.consecuteDays = vumDO.consecutiveDays;
                report.date = dailyReportDate;
                report.address = vumDO.streetAddress;
                report.esiid = vumDO.esiid;
                report.threshold = vumDO.threshold;
                report.unitType = vumDO.unitType;
                report.kwh = vumDO.usageInKwh;
                dailyReportList.push(report);
            })
          }
          LoggerUtil.info("END::MFVUMHelper::getVUMDailyReportListFromResponse()<<<<<<");
          return dailyReportList;
    }

    private populateVumDailyReportRequest(req:any):VumDailyReportRequest{
        LoggerUtil.info("START::MFVUMHelper::populateVumDailyReportRequest()>>>>>>");
        let request = new VumDailyReportRequest();
        let commonUtilityHelper = new CommonUtilityHelper();
        try{
          request.dateRequiredToReturn = (_.isEmpty(req.body.reportDate));
          request.strCompanycode = cst.GMESS_CC_0270;
          request.strLoggedInUserName = CommonUtil.getLoggedInUserName(req);
          request.strDate = req.body.reportDate;
          request.strPortal = cst.GMESS_PORTAL;
          request.strRelationshipId = req.body.relationshipId;
        }catch(e){
          LoggerUtil.error("Error in MFVUMHelper::populateVumDailyReportRequest()::::" +e.message);
        }
        LoggerUtil.info("END::MFVUMHelper::populateVumDailyReportRequest()<<<<<<");
        return request;
    }

    private  isShowConsecutiveWrnMsg( vumDOList:any):boolean{
      vumDOList.forEach((vumDO:any) => {
        if((+(vumDO.consecutiveDays)) > 1){
          return true;
        }
      });
      return false;
    }
}
