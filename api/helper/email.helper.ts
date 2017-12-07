import LoggerUtil from './../logs/log';
import Promise = require('tspromise');
import * as cst from './../util/constant';
import { CommonUtil } from './../util/common.util';
import { CommonUtilityHelper} from '../helper/commonutility.helper';
import * as _ from "lodash";
import { Unit, ESIID} from './../model/bmfss.session';
import { ENVIRONMENT_CONFIG} from './../util/constant';
import { EmailRequest} from './../request/email.request';
import { EmailDO} from './../model/emaildo';
import { EmailService} from './../services/email.service';
import { LDAPHelper} from './../helper/ldap.helper'
import { UpdatePasswordVO} from './../model/updatepasswordvo';
import { IndInvoice } from './../model/billing.model'

export class EmailHelper {

  private emailService: EmailService;
  private StringBuffer = require("stringbuffer");
  constructor() {
        this.emailService = new EmailService();

  }

  public  sendMFStartServiceEmail( unitList:Array<Unit>,txnID:string,txnDate:string,propertyAddress:string,propCity:string,propZipcode:string, req:any):boolean {
   LoggerUtil.info("inside sendMFStartServiceEmail method :----------------------------------------------");
    let emailReq = new EmailRequest();
    let status:boolean = false;
    let subject = ""; //Already set in email template
    let commonUtilityHelper = new CommonUtilityHelper();

   try {
       let emailAddress = "";
       if (null != req) {
         emailAddress = req.body.businessInfo.email;
       }

  		 let meterStartStopInfo = new this.StringBuffer();
       let unitVOSize = unitList.length;
       LoggerUtil.info("UnitVosize is==="+unitVOSize);
       let count = 0;
       unitList.forEach((unitData:Unit) =>{

       meterStartStopInfo.append("<div class='label'>Unit:</div><div class='value'>"
           + CommonUtil.defaultIfEmpty(unitData.strUnitNumber, "")
               + "</div><div class='label'>ESI ID:</div><div class='value'>"
               + CommonUtil.defaultIfEmpty(unitData.esiid, "")
                   + "</div><div class='label'>Effective Date:</div><div class='value'>"
                   + CommonUtil.defaultIfEmpty(unitData.effectiveDate, "")
                       + "</div>");
       count++;
       LoggerUtil.info("count is==="+count);
       if(count<unitVOSize){
         meterStartStopInfo.append("<br/>");
       }
     });
     emailReq.externalId = cst.MF_START_SERVICE_CONFIRMATION_EXTERNAL_ID;
     emailReq.templateType = cst.TEMPLATE_HTML;
     emailReq.toEmailList.push(emailAddress);
     emailReq.propertyList.push(cst.MF_CUSTOMER_NAME+":Customer",
                                cst.MF_TRANSACTION_TIME+":"+CommonUtil.defaultIfEmpty(txnDate, cst.NOT_PROVIDED),
                                cst.MF_TRANSACTION_NUM+":"+CommonUtil.defaultIfEmpty(txnID, cst.NOT_PROVIDED),
                                cst.MF_CONTACT_NAME+":"+ commonUtilityHelper.getLoggedInUserFullName(req),
                                cst.MF_CONTACT_PHONE_NUM+":"+commonUtilityHelper.getLoggedInUserPhonenumber(req),
                                cst.MF_CONTACT_FAX_NUM+":"+commonUtilityHelper.getLoggedInUserFaxnumber(req),
                                cst.MF_CONTACT_EMAIL_ADDRESS+":"+commonUtilityHelper.getLoggedInUserEmail(req),
                                cst.MF_PROPERTY_NAME+":"+CommonUtil.defaultIfEmpty(CommonUtil.getBMFSSSession(req) != null?CommonUtil.getBMFSSSession(req).selectedProperty.customerDtls.customerName:"", ""),
                                cst.MF_SERVICE_STREET_NUM+":"+CommonUtil.defaultIfEmpty(propertyAddress, cst.NOT_PROVIDED),
                                cst.MF_SERVICE_STREET_NAME+":"+"",
                                cst.MF_SERVICE_CITY+":"+ CommonUtil.defaultIfEmpty(propCity, cst.NOT_PROVIDED),
                                cst.MF_SERVICE_STATE+":"+ CommonUtil.defaultIfEmpty("TX", cst.NOT_PROVIDED),
                                cst.MF_SERVICE_ZIP+":"+ CommonUtil.defaultIfEmpty(propZipcode, cst.NOT_PROVIDED),
                                cst.MF_METER_START_INFO+":"+meterStartStopInfo);

  } catch (e) {
          LoggerUtil.error("Failed to setMFStartServiceEmail request::::::: with exception "+ e.message);

  }
  this.sendEmail(emailReq).then(t =>{
        if(undefined != t)
           LoggerUtil.info("Email Sending response is == " +t.resultdescription);
           status = CommonUtil.equalsIgnoreCase(t.resultdescription,"Success");
    });
  LoggerUtil.info("The Email status for external id:::MF_START_SERVICE_CONFIRMATION_EXTERNAL_ID:::::" + status);

   return status;
 }


 public  sendMFStopServiceEmail(unitList:Array<Unit>,txnID:string,txnDate:string,propertyAddress:string,propCity:string,propZipcode:string, req:any):boolean {
   let emailReq = new EmailRequest();
   let status:boolean = false;
   let subject = ""; //Already set in email template
   let commonUtilityHelper = new CommonUtilityHelper();

  try {
      let emailAddress = "";
      if (null != req) {
        emailAddress = req.body.businessInfo.email;
      }
      var StringBuffer = require("stringbuffer");
      let meterStartStopInfo = new StringBuffer();
      let unitVOSize = unitList.length;
      LoggerUtil.info("UnitVosize is==="+unitVOSize);
      let count = 0;
      unitList.forEach((unitData:Unit) =>{

      meterStartStopInfo.append("<div class='label'>Unit:</div><div class='value'>"
          + CommonUtil.defaultIfEmpty(unitData.strUnitNumber, "")
              + "</div><div class='label'>ESI ID:</div><div class='value'>"
              + CommonUtil.defaultIfEmpty(unitData.esiid, "")
                  + "</div><div class='label'>Effective Date:</div><div class='value'>"
                  + CommonUtil.defaultIfEmpty(unitData.effectiveDate, "")
                      + "</div>");
      count++;
      LoggerUtil.info("count is==="+count);
      if(count<unitVOSize){
        meterStartStopInfo.append("<br/>");
      }
    });
    emailReq.externalId = cst.MF_STOP_SERVICE_CONFIRMATION_EXTERNAL_ID;
    emailReq.templateType = cst.TEMPLATE_HTML;
    emailReq.toEmailList.push(emailAddress);
    emailReq.propertyList.push(cst.MF_CUSTOMER_NAME+":Customer",
                               cst.MF_TRANSACTION_TIME+":"+CommonUtil.defaultIfEmpty(txnDate, cst.NOT_PROVIDED),
                               cst.MF_TRANSACTION_NUM+":"+CommonUtil.defaultIfEmpty(txnID, cst.NOT_PROVIDED),
                               cst.MF_CONTACT_NAME+":"+ commonUtilityHelper.getLoggedInUserFullName(req),
                               cst.MF_CONTACT_PHONE_NUM+":"+commonUtilityHelper.getLoggedInUserPhonenumber(req),
                               cst.MF_CONTACT_FAX_NUM+":"+commonUtilityHelper.getLoggedInUserFaxnumber(req),
                               cst.MF_CONTACT_EMAIL_ADDRESS+":"+commonUtilityHelper.getLoggedInUserEmail(req),
                               cst.MF_PROPERTY_NAME+":"+CommonUtil.defaultIfEmpty(CommonUtil.getBMFSSSession(req) != null?CommonUtil.getBMFSSSession(req).selectedProperty.customerDtls.customerName:"", ""),
                               cst.MF_SERVICE_STREET_NUM+":"+CommonUtil.defaultIfEmpty(propertyAddress, cst.NOT_PROVIDED),
                               cst.MF_SERVICE_STREET_NAME+":"+"",
                               cst.MF_SERVICE_CITY+":"+ CommonUtil.defaultIfEmpty(propCity, cst.NOT_PROVIDED),
                               cst.MF_SERVICE_STATE+":"+ CommonUtil.defaultIfEmpty("TX", cst.NOT_PROVIDED),
                               cst.MF_SERVICE_ZIP+":"+ CommonUtil.defaultIfEmpty(propZipcode, cst.NOT_PROVIDED),
                               cst.MF_METER_STOP_INFO+":"+meterStartStopInfo);

 } catch (e) {
         LoggerUtil.error("Failed to setMFStopServiceEmail reuest::::::: with exception "+ e.message);

 }
 this.sendEmail(emailReq).then(t =>{
       if(undefined != t)
          LoggerUtil.info("Email Sending response is == " +t.resultdescription);
          status = CommonUtil.equalsIgnoreCase(t.resultdescription,"Success");
   });
    LoggerUtil.info("The Email status for external id:::MF_STOP_SERVICE_CONFIRMATION_EXTERNAL_ID:::::" + status);
		return status;
	}


	public emailUsConfirmationEmail(req:any, email:string, dateSentOn:string, emailSubject:string,  emailComments:string,  customerCareEmailAddress:string):boolean{
		LoggerUtil.info("START::EmailHelper::emailUsConfirmationEmail()>>>>>>");
    let emailReq = new EmailRequest();
    let status:boolean = false;
    let subject = ""; //Already set in email template
    let commonUtilityHelper = new CommonUtilityHelper();
		try {
			emailComments =encodeURIComponent(emailComments);
			emailComments = encodeURIComponent(emailComments);
      emailReq.externalId = cst.BMF_CUSTOMER_CARE_CONFIRMATION_EXTERNAL_ID;
      emailReq.templateType = "XSLT";
      emailReq.toEmailList.push(email);
      emailReq.propertyList.push(cst.BMF_CUSTOMER_NAME+":"+CommonUtil.defaultIfEmpty(email, ""),
                                 cst.BMF_EMAIL_TIMESTAMP+":"+CommonUtil.defaultIfEmpty(dateSentOn, ""),
                                 cst.BMF_EMAIL_SUBJECT+":"+CommonUtil.defaultIfEmpty(emailSubject, ""),
                                 cst.BMF_ENTERED_COMMENTS+":"+CommonUtil.defaultIfEmpty(emailComments, ""));

     }catch(ex){
       	LoggerUtil.error("FAILED TO SEND EMAIL US CONFIRMATION EMAIL::::::::::",ex);
       			let errorMessage:string = "FAILED TO SEND EMAIL US CONFIRMATION EMAIL TO THIS EMAIL:::::"+email;
       			commonUtilityHelper.addExceptionToBMFSSSchema("EMAIL_FAIL_FE",errorMessage, ex, req);
      }
      this.sendEmail(emailReq).then(t =>{
            if(undefined != t)
               LoggerUtil.info("Email Sending response is == " +t.resultdescription);
               status = CommonUtil.equalsIgnoreCase(t.resultdescription,"Success");
        });

		LoggerUtil.info("The CUSTOMER CARE Email status is::::::::" + status);

		return status;
	}



 public sendEmail(req: any): Promise<any> {
    LoggerUtil.info('Calling sendEmail service with the request::::'+JSON.stringify(req));
    let emailReq = new EmailRequest();
    let emailResp = new EmailDO();
    emailReq.companyCode = cst.GMESS_CC_0270;
    emailReq.externalId = req.externalId;
    emailReq.toEmailList = req.toEmailList;
    emailReq.subject = "";
    emailReq.propertyList = req.propertyList;
    emailReq.templateType = req.templateType;
    emailReq.languageCode = "EN";
    emailReq.brandName = cst.GME_BRAND_NAME;
      var p = new Promise((resolve, reject) => {

          this.emailService.sendEmail(emailReq).then(t =>{
                if(undefined != t && (t.resultcode == 0 || t.resultdescription == "Success")){
                    emailResp.resultcode = t.resultcode;
                    emailResp.resultdescription = t.resultdescription;
                    emailResp.errorcode = t.resultcode;
                    emailResp.errordescription =t.errordescription;
                }else{
                  LoggerUtil.error("Error sending email");
                }
          });
           resolve(emailResp);
      });

      return p;
  }

  public  sendVUMOptInAndOptOutNotificationEmail(emailAddress1:string, emailAddress2:string, optInOrOut:string, req:any) :boolean {
		LoggerUtil.info("START::EmailHelper::sendVUMOptInAndOptOutNotificationEmail()>>>>>>");

    let emailReq = new EmailRequest();
    let statusFlag:boolean = false;
    let subject = ""; //Already set in email template
    let commonUtilityHelper = new CommonUtilityHelper();
    try{
    emailReq.externalId = cst.VUM_OPT_INOUT_EXTERNAL_ID;
    emailReq.templateType = cst.TEMPLATE_HTML;
    emailReq.toEmailList.push(emailAddress1);
    emailReq.toEmailList.push(emailAddress2);
    emailReq.propertyList.push(cst.VUM_OPT_INOUT_BUSINESS_NAME+":"+commonUtilityHelper.getSelectedPropertyBPName(req),
                               cst.VUM_OPT_INOUT_COMMENT_PARTNER+":"+commonUtilityHelper.getSelectedPropertyRelationshipId(req),
                               cst.VUM_OPT_INOUT_COMMENT_CHANGER_FULLNAME+":"+commonUtilityHelper.getLoggedInUserFullName(req),
                               cst.VUM_OPT_INOUT_ON_OFF+":"+optInOrOut);

   }catch(ex){
         LoggerUtil.error("FAILED TO SEND VUM OPT IN AND OPT OUT EMAIL CONFIRMATION EMAIL::::::::::",ex);
          let errorMessage:string = "FAILED TO SEND VUM OPT IN AND OPT OUT EMAIL CONFIRMATION EMAIL::::"+emailAddress1 + " and "+emailAddress2;
          commonUtilityHelper.addExceptionToBMFSSSchema("EMAIL_FAIL_FE",errorMessage, ex, req);
    }
    this.sendEmail(emailReq).then(t =>{
          if(undefined != t)
             LoggerUtil.info("Email Sending response is == " +t.resultdescription);
             statusFlag = CommonUtil.equalsIgnoreCase(t.resultdescription,"Success");
      });

  LoggerUtil.info("The sendVUMOptInAndOptOutNotificationEmail status is::::::::" + status);

  return statusFlag;

	}




     public updatePasswordInLDAPAndSendEmailUpdate(req:any, response:any):string{
      let ldapHelper = new LDAPHelper();
      try{
      let status = ldapHelper.updatePassword(req.body.userName, req.body.password, req);
      if(status){
          let updatePasswordVO = new UpdatePasswordVO();
          updatePasswordVO.userName = (req.body.userName);
          updatePasswordVO.password = (req.body.password);
          updatePasswordVO.emailAddress = (req.body.emailID);
          updatePasswordVO.greetingName = (req.body.firstName);
          updatePasswordVO.telPhNum = (req.body.phoneNum);
          updatePasswordVO.phoneExtnNumber = (req.body.phoneExtn);
          updatePasswordVO.confirmationNumber = (response.transactionId);
          let emailStatus:boolean = this.updatePasswordConfirmationEmail(updatePasswordVO,req);
          LoggerUtil.info("EMAIL HAS BEEN SENT TO THE USERNAME:::::::::::"+req.body.userName+":::::STATUS:::"+emailStatus);
       }
      }catch(e){
         LoggerUtil.error("Error in EmailHelper:updatePasswordInLDAPAndSendEmailUpdate()::: "+e.message);
      }
      return status?"Y":"N";
     }


     public  updatePasswordConfirmationEmail(updatePasswordVO:UpdatePasswordVO, req:any):boolean{

    		let status = false;
    		let emailAddress = updatePasswordVO.emailAddress;
        let emailReq = new EmailRequest();
        let subject = ""; //Already set in email template
        let commonUtilityHelper = new CommonUtilityHelper();
        try{
          emailReq.externalId = cst.UPDATE_PASSWORD_CONFIRMATION_EXTERNAL_ID;
          emailReq.templateType = cst.TEMPLATE_HTML;
          emailReq.toEmailList.push(emailAddress);
          let telPhoneNum:string = CommonUtil.isNotBlank(updatePasswordVO.telPhNum)?
              (updatePasswordVO.telPhNum)+(CommonUtil.isNotBlank(updatePasswordVO.phoneExtnNumber)?" ext "+updatePasswordVO.phoneExtnNumber:""):"NOT_PROVIDED";
          emailReq.propertyList.push(cst.PM_CONFIRMATION_NUM+":"+updatePasswordVO.confirmationNumber,
                                     cst.PM_EMAIL_ADDRESS+":"+updatePasswordVO.emailAddress,
                                     cst.PM_GREETING_NAME+":"+updatePasswordVO.greetingName,
                                     cst.PM_USER_NAME+":"+updatePasswordVO.userName,
                                     cst.PM_TELEPHONE_NUM+":"+telPhoneNum);

       }catch(ex){
             LoggerUtil.error("FAILED TO SEND UPDATE PASSWORD CONFIRMATION EMAIL::::::::::",ex);
              let errorMessage:string = "FAILED TO SEND UPDATE PASSWORD CONFIRMATION EMAIL TO THIS EMAIL:::::"+emailAddress;
              //commonUtilityHelper.addExceptionToBMFSSSchema("EMAIL_FAIL_FE",errorMessage, ex, req);
        }
        this.sendEmail(emailReq).then(t =>{
              if(undefined != t)
                 LoggerUtil.info("Email Sending response is == " +t.resultdescription);
                 status = CommonUtil.equalsIgnoreCase(t.resultdescription,"Success");
          });

      LoggerUtil.info("The updatePasswordConfirmationEmail status is::::::::" + status);

      return status;
    }

    public sendModifyPaymentConfirmEmail(req:any,  confirmationNum:string) :boolean{

		let status = false;
    let commonUtilityHelper = new CommonUtilityHelper();
    let emailAddress = commonUtilityHelper.getLoggedInUserEmail(req)
    let emailReq = new EmailRequest();
    let subject = ""; //Already set in email template

    try{
      emailReq.externalId = cst.BMF_SS_SCHEDULED_PAYMENT_INFO_EXTERNAL_ID;
      emailReq.templateType = cst.TEMPLATE_HTML;
      emailReq.propertyList.push(cst.PROPERTY_NAME+":"+commonUtilityHelper.getSelectedPropertyBPName(req),
                                 cst.PAYMENT_AMOUNT_VAL+":"+req.body.paymentAmount,
                                 cst.PAYMENT_SUBMISSION_DATE+":"+req.body.collPaymentDate,
                                 cst.BANK_ACCOUNT_NUMBER+":"+CommonUtil.maskNumber(req.body.bankAccountNumber,3),
                                 cst.CONFIRMATION_NUMBER+":"+confirmationNum);

   }catch(ex){
         LoggerUtil.error("FAILED TO SEND MODIFY PAYMENT CONFIRMATION EMAIL::::::::::",ex);
          let errorMessage:string = "FAILED TO SEND MODIFY PAYMENT CONFIRMATION EMAIL:::::"+emailAddress;
          commonUtilityHelper.addExceptionToBMFSSSchema("EMAIL_FAIL_FE",errorMessage, ex, req);
    }
    this.sendEmail(emailReq).then(t =>{
          if(undefined != t)
             LoggerUtil.info("Email Sending response is == " +t.resultdescription);
             status = CommonUtil.equalsIgnoreCase(t.resultdescription,"Success");
      });
		LoggerUtil.info("The Email status for external id:::GME_BMF_SS_SCHEDULED_PAYMENT_INFO_EXTERNAL_ID:::::::" + status);

		return status;
	}

  public addUserConfirmEmail( req:any, response:any) {
     LoggerUtil.info("Sending Email for :::ADD_USER_CONFIRMATION::::::::");
 		let status = false;
 		let subject:string;
    let emailReq = new EmailRequest();
    try {
 		let emailAddress = req.body.user.emailAddress;

 		let logonLink = cst.BMF_FIRST_TIME_SET_PASSWORD+"/"+response.transactionId;
     LoggerUtil.info("Sending Email to :::emailAddress ::::::::"+emailAddress);

       emailReq.externalId = cst.ADD_USER_CONFIRMATION_EXTERNAL_ID;
       emailReq.templateType = cst.TEMPLATE_HTML;
       emailReq.toEmailList.push(emailAddress);
       emailReq.propertyList.push("LOGIN_LINK:"+logonLink);

     } catch (e) {
       LoggerUtil.error("Failed to send addUserConfirmEmail::::::: with exception + "+ e.message);
     }

       this.sendEmail(emailReq).then(t =>{
         if(undefined != t)
            LoggerUtil.info("Email Sending response is == " +t);
       });

 	}


   public addUserConfirmAdminEmail(req:any,addUserVO:any) {

    let status = false;
 		let subject:string = "";
 		let emailAddress: string;
    let commonUtilityHelper = new CommonUtilityHelper();
    let emailReq = new EmailRequest();
 	  try {
 		 emailAddress = commonUtilityHelper.getLoggedInUserEmail(req);
     emailReq.externalId = cst.ADD_USER_CONFIRMATION_ADMIN_EXTERNAL_ID;
     emailReq.templateType = cst.TEMPLATE_HTML;
     emailReq.toEmailList.push(emailAddress);
     emailReq.propertyList.push(cst.PM_CUSTOMER_NAME+":"+req.body.businessInfo.firstName,
                                cst.PM_CUSTOMER_FULLNAME+":"+commonUtilityHelper.getLoggedInUserFullName(req));

       this.sendEmail(emailReq).then(t =>{
         if(undefined != t)
            LoggerUtil.info("Email Sending response is == " +t);
       });
 		} catch (e) {
 			LoggerUtil.error("Failed to send addUserConfirmAdminEmail::::::: with exception + "+ e.message);
 		}

 	}

 	public updateUserConfirmEmail(req:any) {

     let status = false;
     let subject:string = "";
     let emailAddress=  req.body.emailID;
     let emailReq = new EmailRequest();

 		let name = req.body.firstName+" "+req.body.lastName;
 		let phNumberExt = req.body.phoneExtn.replace("extn", "");
 		let altNumberExt = req.body.phoneExtnAlt.replace("extn", "");
 		let phNumber = CommonUtil.isNotBlank(req.body.phoneExtn)?(req.body.phoneNum+" ext "+phNumberExt):req.body.phoneNum;
 		let altPhoneNumber = CommonUtil.isNotBlank(req.body.phoneExtnAlt)?(req.body.altPhoneNum+" ext "+altNumberExt):req.body.altPhoneNum;
 		let faxNumber = req.body.faxNum;
 		let emailId = req.body.emailID;
 		let sapId = req.body.sapId;

 		if(_.isEqual(req.body.fieldIndex,("1")))
 			name = "<b>"+name+"</b>";
 		else if(_.isEqual(req.body.fieldIndex,("5")))
 			emailId= "<b>"+emailId+"</b>";
 		else if(_.isEqual(req.body.fieldIndex,("2")))
 			phNumber = "<b>"+(CommonUtil.isNotBlank(phNumber)?phNumber:cst.NOT_PROVIDED)+"</b>";
 		else if(_.isEqual(req.body.fieldIndex,("3")))
 			altPhoneNumber = "<b>"+(CommonUtil.isNotBlank(altPhoneNumber)?altPhoneNumber:cst.NOT_PROVIDED)+"</b>";
 		else if(_.isEqual(req.body.fieldIndex,("4")))
 			faxNumber =  "<b>"+(CommonUtil.isNotBlank(faxNumber)?faxNumber:cst.NOT_PROVIDED)+"</b>";
 		else if(_.isEqual(req.body.fieldIndex,("7"))){
 		    sapId =  "<b>"+(CommonUtil.isNotBlank(sapId)?sapId:"NA")+"</b>";
 		}else if(_.isEqual(req.body.fieldIndex,("6"))){

 		}
     let sapIdClass= "hide";

     if(null !=req.body.sapId && _.isEqual(cst.USERTYPE_INTERNAL,req.body.userCategory) &&
 				_.isEqual(req.body.getWebSecurityRole(), cst.USERTYPE_SP_INT_ADMIN)){
           sapIdClass = "show";
       }else{
           sapIdClass = "hide";
       }
       let accessPrivStr = "";
       if(null !=req.body.userCategory && _.isEqual(cst.USERTYPE_EXTERNAL,(req.body.userCategory)) &&
   				!_.isEqual(req.body.webSecurityRole, cst.USERTYPE_SP_EXT_READ_ONLY)){
             accessPrivStr= this.getAccessPrivInfo(req.body);
   		}
     emailReq.externalId = cst.UPDATE_USER_CONFIRMATION_EXTERNAL_ID;
     emailReq.templateType = cst.TEMPLATE_HTML;
     emailReq.toEmailList.push(emailAddress);
     emailReq.propertyList.push(cst.PM_CUSTOMER_NAME+":"+req.body.userName,
                                cst.PM_UPDATE_NAME+":"+name ,
                                cst.PM_UPDATE_PHNUM+":"+CommonUtil.isNotBlank(phNumber)?phNumber:cst.NOT_PROVIDED,
                                cst.PM_UPDATE_ALTPHNUM+":"+CommonUtil.isNotBlank(altPhoneNumber)?altPhoneNumber:cst.NOT_PROVIDED,
                                cst.PM_UPDATE_FAXNUM+":"+CommonUtil.isNotBlank(faxNumber)?faxNumber:cst.NOT_PROVIDED,
                                cst.PM_UPDATE_EMAIL+":"+emailId,
                                cst.PM_UPDATE_USERNAME+":"+req.body.userName,
                                cst.PM_SAPID_CLASS+":"+sapIdClass,
                                cst.PM_UPDATE_SAPID+":"+ sapId,
                                cst.PM_ACCESSPRIV_INFO+":"+ accessPrivStr);

     try {
       this.sendEmail(emailReq).then(t =>{
         if(undefined != t)
            LoggerUtil.info("Email Sending response is == " +t);
       });
 		} catch (e) {
 			LoggerUtil.error("Failed to send updateUserConfirmEmail::::::: with exception + "+ e.message);
 		}

 	}

   private getAccessPrivInfo(manageUserVO:any):string {
 		LoggerUtil.info("WEB SECURITY ROLE:::::::"+manageUserVO.webSecurityRole);
      var StringBuffer = require("stringbuffer");
 		 let accessPrivInfo = new StringBuffer();
 		 let webSecurityRole = manageUserVO.webSecurityRole;
 		accessPrivInfo.append("<tr><td valign='top' width='15%'>Access privilages:</td><td width='60%'><table><tr><td>");
 		if(_.isEqual(webSecurityRole, cst.USERTYPE_SP_EXT_CA_PO) || _.isEqual(webSecurityRole, cst.USERTYPE_SP_EXT_CA_PM)){
 			accessPrivInfo.append("transactional access"
 					+ "</td></tr><tr><td>");
 			accessPrivInfo.append("&nbsp;&nbsp;"+"-able to request start and stop"
 					+ "</td></tr><tr><td>");
 			accessPrivInfo.append("&nbsp;&nbsp;"+"-able to pay bills"
 					+ "</td></tr></table></td></tr>");
 		}else if(_.isEqual(webSecurityRole, cst.USERTYPE_SP_EXT_CUS_ASC)){
 			accessPrivInfo.append("transactional access"
 					+ "</td></tr><tr><td>");
 			accessPrivInfo.append("&nbsp;&nbsp;"+"-Can start/stop: <b>"+(_.isEqual(manageUserVO.getStartStopAce(), cst.YES)?cst.YES_TXT:cst.NO_TXT)
 						+ "</b></td></tr><tr><td>");
 			accessPrivInfo.append("&nbsp;&nbsp;"+"-Can pay bills: <b>"+(_.isEqual(manageUserVO.getBillingAce(), cst.YES)?cst.YES_TXT:cst.NO_TXT)
 							+ "</b></td></tr></table></td></tr>");
 		}else if(_.isEqual(webSecurityRole, cst.USERTYPE_SP_EXT_BROKER) || _.isEqual(webSecurityRole, cst.USERTYPE_SP_EXT_BRK_ASC)){
 			let logonLink = cst.GMESS_HOST_INFO;
 			LoggerUtil.info("getting the link::::::"+logonLink);
 			accessPrivInfo.append("<a href='"+logonLink+"'>Log in</a>"+" to SimpleSource to view permissions for each property."
 					+ "</td></tr><tr><td>");
 		}else{
 			accessPrivInfo.append("Administrative Access"
 					+ "</b></td></tr><tr><td> <b>");
 		}
 		return accessPrivInfo.toString();

 	}

  public sendPasswordResetLinkEmail(emailAddress:string, response:any):string {

       let status :string;
       let subject:string = "";
       let emailReq = new EmailRequest();
      try {
     		let logonLink = cst.BMF_FIRST_TIME_SET_PASSWORD+"?txnId="+response.transactionId;

         emailReq.externalId = cst.RESET_PASSWORD_EXTERNAL_ID;
         emailReq.templateType = cst.TEMPLATE_HTML;
         emailReq.toEmailList.push(emailAddress);
         emailReq.propertyList.push(cst.PM_LOGIN_LINK, "<p><a href='"+logonLink+"'>"+logonLink+"</a></p>");
         this.sendEmail(emailReq).then(t =>{
           if(undefined != t)
              LoggerUtil.info("Email Sending response is == " +t);
              status = t.resultdescription;
         });
       } catch (e) {
         LoggerUtil.error("Failed to send Reset Password:::::::  with exception + "+ e.message);
       }
      return status;
   	}


  protected  sendPaymentConfirmEmail(req:any) {
    let status = false;
    let commonUtilityHelper = new CommonUtilityHelper();
    let emailAddress = commonUtilityHelper.getLoggedInUserEmail(req)
    let emailReq = new EmailRequest();
    let subject = ""; //Already set in email template

		try {
			if(req.body.paymentStatus){
        emailReq.externalId = cst.BILLPAY_PAY_CONFIRMATION_EXTERNAL_ID;
        emailReq.templateType = cst.TEMPLATE_HTML;
        emailReq.toEmailList.push(emailAddress);
        emailReq.propertyList.push(cst.EMAIL_CUSTOMER_NAME+":"+commonUtilityHelper.getSelectedPropertyBPName(req),
                                   cst.ERROR_MESSAGE+":"+this.getPaymentConfirmationEmailErrMsg(req) ,
                                   cst.BILL_PAY_EMAIL_BODY+":"+this.getpaymentConfirmationEmailBody(req),
                                   cst.PAYMENT_INFORMATION+":"+this.getPaymentInfoForPaymentConfirmationEmail(req),
                                   cst.TOTAL_PAYMENT+":"+this.getTotalPaymentForPaymentConfirmationEmail(req)
                                 );

          this.sendEmail(emailReq).then(t =>{
            if(undefined != t)
               LoggerUtil.info("Email Sending response is == " +t);
          });

			}else{
        LoggerUtil.info("PAYMENT STATUS IN EMAIL:::::::"+req.body.paymentStatus);
      }

		}catch (e) {
      LoggerUtil.error("Failed to send updateUserConfirmEmail::::::: with exception + "+ e.message);
      let errorMessage = "FAILED TO SEND PAYMENT CONFIRMATION EMAIL TO THIS EMAIL:::::"+emailAddress;
     commonUtilityHelper.addExceptionToBMFSSSchema("EMAIL_FE",errorMessage,e.message,req);
    }

	}

  private  getPaymentConfirmationEmailErrMsg(req:any):string {

		let strErrorMsg = new this.StringBuffer();
    try{
  		if (req.body.errorMsg) {
  			strErrorMsg.append("<p class='errd b'>An error occurred while processing your payment to certain account. Affected accounts are identified below.</p>");
  		} else {
  			strErrorMsg.append("");
  		}
    }catch(e){
      LoggerUtil.error("Error in getPaymentConfirmationEmailErrMsg():::"+e.message)
    }
		return strErrorMsg.toString();
	}


	private  getpaymentConfirmationEmailBody(req:any):string {

		let strPaymentEmailBody = new this.StringBuffer();
    try{
  		if (_.isEmpty(req.body.collPaymentAmount)) {
  			strPaymentEmailBody = this.getpaymentConfirmationEmailBodyForIndividual(req, strPaymentEmailBody);
  		}else{
  			strPaymentEmailBody = this. getpaymentConfirmationEmailBodyForCollective(req, strPaymentEmailBody);
  		}
    }catch(e){
      LoggerUtil.error("Error in getpaymentConfirmationEmailBody()::::"+e.message)
    }

		return strPaymentEmailBody.toString();
	}


	private  getpaymentConfirmationEmailBodyForIndividual(req:any, strPaymentEmailBody:any):any{
    let commonUtilityHelper = new CommonUtilityHelper();
		try{
      req.body.selectedCADtlList.forEach((indInv:IndInvoice)=>{

			if (!indInv.paymentSuccessfulOnThisCA){
				strPaymentEmailBody.append("<tr class ='errd b'>");
			}else{
				strPaymentEmailBody.append("<tr>");
			}
			strPaymentEmailBody.append("<td>");
			if (commonUtilityHelper.isBuilder(req)){
				strPaymentEmailBody.append(indInv.builderAddress);
			}else{
				strPaymentEmailBody.append(indInv.propertyUnit);
			}
			strPaymentEmailBody.append(',');
			strPaymentEmailBody.append("&nbsp;");
			strPaymentEmailBody.append(this.appendCA(indInv.contractAccount));
			strPaymentEmailBody.append("</td>");
			strPaymentEmailBody.append("<td class='ag'>");
			strPaymentEmailBody.append("$"+indInv.paymentAmount);
			strPaymentEmailBody.append("</td>");
			strPaymentEmailBody.append("<td class='ag'>&nbsp;</td>");
			if (!indInv.paymentSuccessfulOnThisCA) {
				strPaymentEmailBody.append("<td class='ag'>&nbsp;</td>");
				strPaymentEmailBody.append("<b>Payment Unsuccessful</b>");
			}
			strPaymentEmailBody.append("</tr>");
		});
  }catch(e){
    LoggerUtil.error("Error in getpaymentConfirmationEmailBodyForIndividual()::: "+e.message)
  }

		return strPaymentEmailBody;
	}

  private appendCA( contractAccount:string):string{

		if(CommonUtil.isNotBlank(contractAccount)){
			return "CA #"+contractAccount;
		}else{
			return "";
		}

	}


	private  getpaymentConfirmationEmailBodyForCollective(req:any, strPaymentEmailBody:any):any{
		try{
		strPaymentEmailBody.append("<tr>");
		strPaymentEmailBody.append("<td>");
		strPaymentEmailBody.append(this.appendCA(req.body.collContractAccount));
		strPaymentEmailBody.append("</td>");
		strPaymentEmailBody.append("<td class='ag'>");
		strPaymentEmailBody.append(" " + "$"+req.body.collPaymentAmount);
		strPaymentEmailBody.append("</td>");
		strPaymentEmailBody.append("<td class='ag'>&nbsp;</td>");
		strPaymentEmailBody.append("</tr>");
    }catch(e){
      LoggerUtil.error("Error in getpaymentConfirmationEmailBodyForCollective():::"+e.message)
    }

		return strPaymentEmailBody;
	}

	private  getTotalPaymentForPaymentConfirmationEmail(req:any):string {

		let strPayment = new this.StringBuffer();
    try{
		if (!req.body.errorMsg) {
			strPayment = this.getTotalPaymentForPaymentConfirmationEmailIfNoError(strPayment,req);
		}else{
			strPayment = this.getTotalPaymentForPaymentConfirmationEmailIfError(strPayment,req);
		}
  }catch(e){
    LoggerUtil.error("Error in getTotalPaymentForPaymentConfirmationEmail()::"+e.message)
  }

		return strPayment.toString();
	}


	private getTotalPaymentForPaymentConfirmationEmailIfNoError( strPayment:any,req:any):any{
		try{
  		strPayment.append("<tbody>");
  		strPayment.append("<tr>");
  		strPayment.append("<td class='b'>Total Payment Amount:</td>");
  		strPayment.append("<td class='b'>");
  		strPayment.append("$"+(CommonUtil.equalsIgnoreCase(req.body.billingType, cst.BILLING_INDIVIDUAL)?
  				req.body.indPaymentAmount:req.body.collPaymentAmount));
  		strPayment.append("</td>");
  		strPayment.append("</tr>");
  		strPayment.append("</tbody>");

    }catch(e){
      LoggerUtil.error("Error in getTotalPaymentForPaymentConfirmationEmailIfNoError()::::"+e.message);
    }

		return strPayment;
	}


	private  getTotalPaymentForPaymentConfirmationEmailIfError(strPayment:any,req:any):any{
		try{
  		strPayment.append("<tbody>");
  		strPayment.append("<tr>");
  		strPayment.append("<td class='b'>Submitted Payment Amount:</td>");
  		strPayment.append("<td class='b'>");
  		strPayment.append("$"+req.body.indPaymentAmount);
  		strPayment.append("</td>");
  		strPayment.append("</tr>");
  		strPayment.append("<tr>");
  		strPayment.append("<td class='b'>Confirmed Payment Amount:</td>");
  		strPayment.append("<td class='b'>");
  		strPayment.append("$"+req.body.confirmPaymentAmount);
  		strPayment.append("</td>");
  		strPayment.append("</tr>");
  		strPayment.append("</tbody>");
    }catch(e){
        LoggerUtil.error("Error in getTotalPaymentForPaymentConfirmationEmailIfNoError()::::"+e.message);
    }

		return strPayment;
	}

  private  getPaymentInfoForPaymentConfirmationEmail(req:any):string {
		let commonUtilityHelper = new CommonUtilityHelper();
		let strPayInfo = new this.StringBuffer();
    try{
  		strPayInfo.append("<tbody>");
  		strPayInfo.append("<tr>");
  		strPayInfo.append("<td class='b'>Property:</td>");
  		strPayInfo.append("<td>");
  		strPayInfo.append(commonUtilityHelper.getSelectedPropertyBPName(req));
  		strPayInfo.append("</td>");
  		strPayInfo.append("</tr>");
  		strPayInfo.append("<tr>");
  		strPayInfo.append("<td class='b'>Payment Date:</td>");
  		strPayInfo.append("<td>");
  		strPayInfo.append(CommonUtil.equalsIgnoreCase(req.body.billingType, cst.BILLING_INDIVIDUAL)?
  				req.body.indPaymentDate:req.body.collPaymentDate);
  		strPayInfo.append("</td>");
  		strPayInfo.append("</tr>");
  		strPayInfo.append("<tr>");
  		strPayInfo.append("<td class='b'>Bank Account Number:</td>");
  		strPayInfo.append("<td>");
  		strPayInfo.append(CommonUtil.maskNumber(req.body.bankAccountNum,3));
  		strPayInfo.append("</td>");
  		strPayInfo.append("</tr>");
  		strPayInfo.append("</tbody>");
   }catch(e){
     LoggerUtil.error("Error in getPaymentInfoForPaymentConfirmationEmail()::: "+e.message)
   }

		return strPayInfo.toString();
	}



}
