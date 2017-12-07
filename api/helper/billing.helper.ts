import LoggerUtil from './../logs/log';
import Promise = require('tspromise');
import { UserDtlsForRstPswdRequest } from '../request/profile.request';
import * as cst from './../util/constant';
import { CommonUtil } from './../util/common.util';
import { BillingService } from '../services/billing.service';
import {BankDetailsDO, BankAccount, SubmitPayment, SubmitPaymentRequestDO,Payment, IndInvoice, PreviousBill, PaymentHistory, PaymentHistoryDO, BillInvoices, CollectiveInvoice, IndividualInvoice } from '../model/billing.model'
import {BankDetailsRequest, SubmitPaymentRequest, PreviousBillsRequest, PaymentHistoryRequest, ModifyPaymentRequest, CancelPaymentRequest, BillingDetailsRequest } from './../request/billingdetails.request'
import  * as moment  from 'moment';
import {CommonUtilityHelper} from './../helper/commonutility.helper'
import {EmailHelper} from './../helper/email.helper'
import bigDecimal = require('js-big-decimal');
import * as _ from "lodash";

export class BillingHelper {

  private billingService: BillingService;
  private commonUtilityHelper: CommonUtilityHelper;

  constructor(){
      this.billingService = new BillingService();
      this.commonUtilityHelper = new CommonUtilityHelper();
  }


  /*  public getPreviousBills(req: any): Promise<any> {

        let previousBillList = new Array<PreviousBill>();
        var p = new Promise((resolve, reject) => {

            for(var i=0; i< 10; i++){
                let previousBill = new PreviousBill();
                previousBill.invoiceDate = "09/87/0009";
                previousBill.startBillPeriod = '09/09/9999';
                previousBill.endBillPeriod = "09/09/5000";
                previousBill.billType = "billtype";
                previousBill.dueDate = '09/09/9999';
                previousBill.invoiceAmount = "20"+i;
                previousBill.invoiceNumber = "20890898"+i;
                previousBillList.push(previousBill);
            }
            resolve(previousBillList)
        })
        return p;

    }


  */

    public getPaymentHistory(req: any): Promise<any> {

        let paymentHistoryList = new Array<PaymentHistory>();
        var p = new Promise((resolve, reject) => {

            for(var i=0; i< 10; i++){
                let paymentHistory = new PaymentHistory();
                paymentHistory.receivedBy = "Website";
                paymentHistory.accountNumber = '010100000'+i;
                paymentHistory.paymentDescription = "210 fannin st";
                paymentHistory.paymentAmount = "23.9"+i;
                paymentHistory.postingDate = "09/12/2018";
                paymentHistory.status = "POSTED";
                if(i == 2){
                  paymentHistory.status = "SCHEDULED";
                }
                if(i == 4){
                  paymentHistory.status = "CANCELLED";
                }
                if(i == 6){
                  paymentHistory.status = "RETURNED";
                }
                if(i == 5){
                  paymentHistory.status = "SENT";
                }
                paymentHistory.scheduledCancelDate = "02/22/2108";
                paymentHistoryList.push(paymentHistory);
            }
            resolve(paymentHistoryList)
        })
        return p;

    }

    public  getPreviousBills(req: any) :Promise<any> {
  		LoggerUtil.info("START::BillingHelper::getPreviousBillsWS()>>>>>>");
      let commonUtilityHelper = new CommonUtilityHelper();
  		let request = this.getPreviousBillsRequest(req);
      let previousBillList = new Array<PreviousBill>();
      var p = new Promise((resolve, reject) => {
           this.billingService.getPreviousBills(request).then(s => {
              resolve(this.populatePreviousBills(s));
           });
      });
  		return p;
  	}


    public getContractAccountList(req: any): Promise<any>{
        return this.commonUtilityHelper.getStructuralDetails(req);
    }

    private populatePreviousBills(s:any): PreviousBill[] {

        let previousBillList = new Array<PreviousBill>();
        try{
          if(null != s && s.dataAvilableForInput){
              s.previousBillsList.forEach((bill:any) => {
                  let pb = new PreviousBill();
                  pb.billType = bill.dueDate;
                  pb.dueDate = bill.dueDate;
                  pb.endBillPeriod = bill.endBillPeriod;
                  pb.invoiceAmount = bill.amountDue;
                  pb.invoiceDate = bill.invoiceDate;
                  pb.invoiceNumber = bill.invoiceNumber;
                  pb.startBillPeriod = bill.startBillPeriod;
                  previousBillList.push(pb);
              });
          }
        }catch(err){
          LoggerUtil.info("ERROR======populatePreviousBills()===>"+err.message)
        }
        return previousBillList;
    }


    private getPreviousBillsRequest(req: any): PreviousBillsRequest {

      let request = new PreviousBillsRequest();
      request.strCompanycode = cst.GMESS_CC_0270;
      request.strContractAccNumber = req.body.contractAccNumber;
      request.accountType = req.body.accountType;//collective or Individual Service layer will call different rfc depending on the account type
      request.strFromDateyhymhyd = moment().subtract(14, 'month').format('YYYY-MM-DD');
      request.strToDateyhymhyd = moment().format('YYYY-MM-DD');
      request.strLoggedInUserName = CommonUtil.getLoggedInUserName(req);
      return request;
    }

/*
   public getPaymentHistory(req:any):Promise<any> {
       LoggerUtil.info("START::BillingHistoryHelper::getPaymentHistory())>>>>>>");
       let paymentHisList = new Array<PaymentHistory>();
       let request: PaymentHistoryRequest = this.populatePaymentHistoryRequest(req);
       var p = new Promise((resolve, reject) => {
            this.billingService.getPaymentHistory(request).then(s => {
          if(null != s && s.dataAvilableForInput){
            paymentHisList = this.returnPaymentHistoryListFromResponseWithFormattedDates(s.paymentHistoryDOList);
          }else{
            LoggerUtil.info("NO PAYMENT HISTORY RESPONSE FOR THE CONTRACT ACCOUNT::::"+req.body.contractAccount+":::ACCOUNT TYPE::"+req.body.accountType);
          }
         });
         resolve(paymentHisList);
      });
       return p;
  }*/

  private  populatePaymentHistoryRequest(req:any):PaymentHistoryRequest{
		let commonUtilityHelper = new CommonUtilityHelper();
		let request = new PaymentHistoryRequest();
    let bpNumber= req.body.bpNumber;
    let contractAccount = req.body.contractAccount;
    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate;
    try{
  		request.strCompanycode = (cst.GMESS_CC_0270);
  		LoggerUtil.info("GETTING PAYMENT HISTORY FOR THE BP NUMBER::::::::"+req.body.bpNumber+":::CA:::"+contractAccount+":::FROM DATE::"
  						+fromDate+":::TO DATE:::"+toDate);
  		request.strBppNumber = (bpNumber);
  		request.strContractAccNumber = (contractAccount);
  		request.strFromDateyhymhyd = (fromDate);
  		request.strToDateyhymhyd = (toDate);
  		request.strLoggedInUserName = (commonUtilityHelper.getLoggedInUserName(req));
    }catch(e){

    }
		return request;

	}

  private returnPaymentHistoryListFromResponseWithFormattedDates(paymentHisList:Array<PaymentHistoryDO>):Array<PaymentHistory>{

 		let payHisList = new Array<PaymentHistory>();
 		if(null != paymentHisList){
      paymentHisList.forEach((paymentHistoryDO : PaymentHistoryDO) =>{
 				let payHis = new PaymentHistory();
 				payHis.bankAccNum = (paymentHistoryDO.bankAccNum);
 				payHis.bpNumber = (paymentHistoryDO.bpNumber);
 				payHis.city = (paymentHistoryDO.city);
 				payHis.confirmNum = (paymentHistoryDO.confirmNum);
 				payHis.accountNumber = (paymentHistoryDO.contractAccountNum);
 				payHis.isCollective = (paymentHistoryDO.isCollective);
 				payHis.paymentAmount = (paymentHistoryDO.paymentAmount);
 				payHis.paymentDescription=(paymentHistoryDO.paymentDescription);
 				payHis.paymentDocNum=(paymentHistoryDO.paymentDocNum);
 				payHis.paymentID=(paymentHistoryDO.paymentID);
 				payHis.paymentLot=(paymentHistoryDO.paymentLot);
 				payHis.postingDate=moment(paymentHistoryDO.postingDate).format("MM/dd/yyyy");
 				payHis.receivedBy = (paymentHistoryDO.receivedBy);
 				payHis.routingNum = (paymentHistoryDO.routingNum);
 				payHis.scheduledCancelDate=moment(paymentHistoryDO.scheduledCancelDate).format("MM/dd/yyyy");
 				payHis.status=(paymentHistoryDO.status);
 				payHis.state = (paymentHistoryDO.state);
 				payHis.streetName = (paymentHistoryDO.streetName);
 				payHis.streetNo=(paymentHistoryDO.streetNo);
 				payHis.unitNo = (paymentHistoryDO.unitNo);
 				payHis.zipCode= (paymentHistoryDO.zipCode);
 				payHis.maskBankAccount=(paymentHistoryDO.bankAccNum);//masking will be done in frontend
 				payHisList.push(payHis);
 			});
 		}

 		return payHisList;
 	}

  public modifyPayment(req:any):Promise<any> {
    let commonUtilityHelper =new CommonUtilityHelper();
    let emailHelper = new EmailHelper();
      LoggerUtil.info("START::BillingHistoryHelper::modifyPayment()>>>>>>");
      let paymentHisList = new Array<PaymentHistory>();
      let request: ModifyPaymentRequest = this.populateModifyPaymentRequest(req);
      var p = new Promise((resolve, reject) => {
           this.billingService.modifyPayment(request).then(s => {
         if(null != s && s.cancelPaymentSuccess && s.paymentSubmitSuccess){
          resolve({confirmationNumber:s.confirmationNum, submittedOn:moment.now()})
          emailHelper.sendModifyPaymentConfirmEmail(req,s.getConfirmationNum());
         }else{
           commonUtilityHelper.addExceptionToBMFSSSchema("MODIFY_PAYMENT_FE",s.errorMessage, "",req);
           LoggerUtil.info("ModifyPayment failed!! "+s.errorMessage);
         }
        });

     });
      return p;
 }




 private  populateModifyPaymentRequest(req:any):ModifyPaymentRequest{
   let commonUtilityHelper = new CommonUtilityHelper();
   let request = new ModifyPaymentRequest();

   try{
     request.bankAccountNumber= (req.body.bankAccountNumber);
     request.billingType = (req.body.billingType);
     request.bpNumber = (req.body.bpNumber);
     request.caNumber= (req.body.caNumber);
     request.cancelPaymentId = (req.body.cancelPaymentId);
     request.loggedInUserName = (commonUtilityHelper.getLoggedInUserName(req));
     request.maskedBankAccount = CommonUtil.maskNumber(req.body.bankAccountNumber,3);
     request.newPaymentAmount = req.body.newPaymentAmount;
     request.newPaymentDate = req.body.newPaymentDate;
     request.nickName = req.body.nickName;
     request.oldPaymentAmount = req.body.oldPaymentAmount;
     request.oldPaymentDate = req.body.oldPaymentDate;
     request.relationshipId = commonUtilityHelper.getSelectedPropertyRelationshipId(req);
     request.routingNumber = req.body.routingNum;

   }catch(e){

   }
   return request;

 }

 /**
  * call for the cancel payment for both collective and individual accounts.
  * It will call the NRG WS PAYMENT DOMAIN FOR PAYMENT CANCELLATION
  * @param PaymentCancelVO
  * @return Status.
  */
   public  cancelPayment(req:any):Promise<any>{

      let commonUtilityHelper = new CommonUtilityHelper();
       let request = this.populateCancelPaymentRequest(req);
       var p = new Promise((resolve, reject) => {
        this.billingService.cancelPayment(request).then(s => {
            if(null != s && CommonUtil.equalsIgnoreCase(s.strStatus,"00")){
               resolve({status:"Y", cancelDate:moment.now()})
              //TODO emailHelper.sendPaymentCancelEmail(req;
              }else{
                commonUtilityHelper.addExceptionToBMFSSSchema("BILLING_ERROR_FE",s.errorMessage, "",req);
                 resolve({status:"N"})
                LoggerUtil.info("ModifyPayment failed!! "+s.errorMessage);
              }
             });

        });

   return  p;
 }


   private  populateCancelPaymentRequest(req:any):CancelPaymentRequest{

       let request = new CancelPaymentRequest();
       try{
         request.strBanAccNumber = (req.body.bankAccountNum);
         request.strCANumber = (req.body.contractAccountNumber);
         request.strCompanyCode = (cst.GMESS_CC_0270);
         request.strPaymentID =  (req.body.paymentID);
       }catch(e){
         LoggerUtil.error("Error in populateCancelPaymentRequest()::: "+e)
       }
       return request;
   }


   /**
   * Gets the Billing invoices on the click on Pay bill on lefe navigation.
   * It returns both collective and individual invoices for the relationship id of the property.
   */
   public getBillingDetails(req: any): Promise<any> {
    let commonUtilityHelper = new CommonUtilityHelper()
		let request:BillingDetailsRequest = this.populateBillingDetailsRequest(req);
    var p = new Promise((resolve, reject) => {
     this.billingService.getBillingDetails(request).then(s => {
       let invoices =  new BillInvoices();
       if(null != s && undefined != s){
         invoices = this.processCollAndIndvBillInvoices(s, req);
       }else{
         let errorMessage = "BP NUMBER INPUT LIST TO GET THE BILLING INVOICES:::";
			   //commonUtilityHelper.addExceptionToBMFSSSchema("BILLING_FE",errorMessage, errorMessage, req);
       }
       resolve(invoices)
     });
    })
    return p;
	}

  private  populateBillingDetailsRequest(req:any):BillingDetailsRequest{
    let commonUtilityHelper = new CommonUtilityHelper();
    let request = new BillingDetailsRequest();
    try{
      let CAAandNONCAABPList:string[] = commonUtilityHelper.getCAAAndNONCAABPNumberListUnderMasterNode(req);
      LoggerUtil.info("BP NUMBER LIST FOR THE BILLING INVOICES:::::::::"+CAAandNONCAABPList);

      request.bpNumberList = (CAAandNONCAABPList);
      request.strCompanycode = (cst.GMESS_CC_0270);
      request.strPortal =(cst.GMESS_PORTAL);
      request.strLoggedInUserName = (commonUtilityHelper.getLoggedInUserName(req));
    }catch(e){
      LoggerUtil.error("Error in BillingHelper::populateBillingDetailsRequest():::"+e.message);
    }
    return request;
  }

  private processCollAndIndvBillInvoices(response:any, req:any):BillInvoices {

        let billInvoices = new BillInvoices();
        let collInvList = new Array<CollectiveInvoice>();

        let c1 = new CollectiveInvoice();
        c1.accountType = "Common Areas"
        c1.bpNumber = "0000909099";
        c1.contractAccount = "333123890534";
        c1.currentBalance = "23.89";
        c1.dueDate = "09112/2018";
        c1.invoiceNumber= "23111111111";
        c1.ncaStatus = "Y"
        c1.pastDue = "0.00"
        c1.lastPaymentDate= "09/01/2017"

        let c2 = new CollectiveInvoice();
        c2.accountType = "Common Areas"
        c2.bpNumber = "1111222233";
        c2.contractAccount = "345341111111";
        c2.currentBalance = "99.99";
        c2.dueDate = "09/12/2019";
        c2.invoiceNumber= "23111111112";
        c2.ncaStatus = "Y"
        c2.pastDue = "0.00"
        c2.lastPaymentDate= "09/01/2017"

        let c3 = new CollectiveInvoice();
        c3.accountType = "Vacant Units"
        c3.bpNumber = "0098991122";
        c3.contractAccount = "6567657655656";
        c3.currentBalance = "23.99";
        c3.dueDate = "09/12/2019";
        c3.invoiceNumber= "23111111113";
        c3.ncaStatus = "Y"
        c3.pastDue = "23.90"
        c3.lastPaymentDate= "09/01/2017"

        collInvList.push(c1);
        collInvList.push(c2);
        collInvList.push(c3);

        billInvoices.structuralDetailsFound = true;
        billInvoices.arDetailsFound = true;
        billInvoices.collectiveInvoices = collInvList;

        return billInvoices;
  }

  /*
  private processCollAndIndvBillInvoices(response:any, req:any):BillInvoices {
  		LoggerUtil.info("START BillingHelper processCollectiveAndIndividualBillingInvoices()>>>>>>>");
  		let billInvoices = new BillInvoices();
      let commonUtilityHelper = new CommonUtilityHelper();
      try{
      	if(null != response && CommonUtil.equalsIgnoreCase(response.arDetailsFound, "Y") &&
      			CommonUtil.equalsIgnoreCase(response.structuralDetailsFound, "Y")){
      		  billInvoices.structuralDetailsFound = (CommonUtil.equalsIgnoreCase(response.structuralDetailsFound, "Y"));
          	billInvoices.arDetailsFound =(CommonUtil.equalsIgnoreCase(response.arDetailsFound, "Y"));
  	    	if(null != response.collectiveInvoices && response.collectiveInvoices.length >0){
  	    		let collInvList = new Array<CollectiveInvoice>();
            response.collectiveInvoices.forEach((collDO:CollectiveInvoice) => {
                let collInvoice = new CollectiveInvoice();
                collInvoice.accountType = commonUtilityHelper.getInvoicesAccountTypeForBilling(collDO.accountType,req);
                collInvoice.bpNumber = (collDO.bpNumber);
            		collInvoice.contractAccount = (collDO.contractAccount);
            		collInvoice.currentBalance = this.returnZeroIfItIsNegativeAmount(collDO.currentBalance);
            		collInvoice.dueDate = (collDO.dueDate);
            		LoggerUtil.info("Invoice Number is " + collDO.invoiceNumber +" END");
            		if(BillingHelper.isBillingDateIsCurrentDayMinusOneBusinessDay(collDO.billingDate, "MM/dd/yyyy"))
            			collInvoice.invoiceNumber=(collDO.invoiceNumber);
            		collInvoice.ncaStatus=(collDO.ncaStatus);
            		collInvoice.pastDue=(this.returnZeroIfItIsNegativeAmount(collDO.pastDue));
            		collInvoice.lastPaymentDate=(collDO.lastPaymentDate);
            		collInvList.push(collInvoice);
            });
  	    	 	LoggerUtil.info("THE COLLECTIVE INVOICES LIST SIZE::::::::"+collInvList.length);
  	    	 	billInvoices.collectiveInvoices = (collInvList);
  	    	}
  	    	if(null != response.individualInvoices && response.individualInvoices.length >0){
  	    		billInvoices = this.getIndividualInvoicesFromResponse(billInvoices,response,req);
  	    		LoggerUtil.info("THE INDIVIDUAL INVOICES LIST SIZE::::::::"+billInvoices.individualInvoices.length);
  	    	}
  		 }else{
  			LoggerUtil.info("AR DETAILS OR STRUCTURAL DETAILS NOT FOUND::::::");
      		billInvoices = this.getBillingInvoicesIfNoARDetailsFoundOrNOStructuralDtlsFound(billInvoices,response,req);
      	 }
    }catch(e){
    LoggerUtil.error("Error in BillingHelper:::");
  }
   return billInvoices;
}*/


private  returnZeroIfItIsNegativeAmount(strAmount:string):string{
  		try{
    		let amount = new bigDecimal(strAmount);
    		if((amount.compareTo(new bigDecimal(0))) < 0){
    			return "0.00";
    		}

      }catch(e){
        LoggerUtil.error("Error in returnZeroIfItIsNegativeAmount()::: "+e.message);
      }
		return strAmount;
	}

  protected static  isBillingDateIsCurrentDayMinusOneBusinessDay( billingDateAsStr:string,  dateFormatPattern:string):boolean
	{
 		let billingDate:any = null;
 		let todaysDate:any = null;
 		let daysDifference:number = 1;
 		try
 		{
 			 	todaysDate = moment(moment.now(),dateFormatPattern);
	 		if(billingDateAsStr!=null && billingDateAsStr!=(""))
	 		{
	 			billingDate = moment(billingDateAsStr,dateFormatPattern);
	 		}


	 		let day = moment(moment.now()).day();

	 		switch (day) {
	 		case 6:
	 	    	daysDifference = 2;

	 	    case 7:
	 	    	daysDifference = 3;

	 	   case 1:
	 	    	daysDifference = 3;

	 		}

	 		if(billingDate != null && todaysDate != null)
	 		{
	 			if(todaysDate.diff(billingDate,'days') > 0 && todaysDate.diff(billingDate,'days') >= daysDifference )
	 			{
	 				LoggerUtil.info("Billing date is <= than current day - 1 business day");
	 				return true;
	 			}
	 		}
 		}catch(ex){
	 		LoggerUtil.error("EXCEPTION OCCURED WHILE CONVERTING STRING TO BILLING DATE::::",ex);
	 	}
 		LoggerUtil.error("SKIPPING because of billing date is not current day - 1 business day " + billingDateAsStr);
 		return false;
	}

  private  getIndividualInvoicesFromResponse( billInvoices:BillInvoices, response:any, req:any):BillInvoices{
    let cmnAreaInvoiceList = new Array<IndInvoice>();
    let  resInvoiceList = new Array<IndInvoice>();
    let individualInvoices = new Array<IndividualInvoice>();
    let commonUtilityHelper = new CommonUtilityHelper();
    try{

		let NONCAABPNumList:Array<string>= commonUtilityHelper.getNONCAABPNumberListUnderMasterNode(req);
		let CAABPNumList :Array<string>= commonUtilityHelper.getCAABPNumberListUnderMasterNode(req);
		let indInvList:Array<IndInvoice> = response.individualInvoices;
    indInvList.forEach((indDO:IndInvoice) =>{
	 		 LoggerUtil.info("START Individual " + indDO.billingDate+" END");
    		let invoice = new IndInvoice();
    		invoice.bpNumber = (indDO.bpNumber);
    		invoice.builderAddress = (indDO.builderAddress);
    		invoice.contractAccount = (indDO.contractAccount);
    		invoice.currentBalance = (this.returnZeroIfItIsNegativeAmount(indDO.currentBalance));
    		invoice.currentBalanceFlag = (new bigDecimal(indDO.currentBalance).compareTo(new bigDecimal('0')) > 0);
    		invoice.pastDueFlag = (new bigDecimal(indDO.pastDue).compareTo(new bigDecimal('0')) > 0);
    		invoice.dueDate = (indDO.dueDate);
    		invoice.finalBill = (indDO.finalBill);
    		LoggerUtil.info("Invoice Number is " + indDO.invoiceNumber +" END");
    		if(BillingHelper.isBillingDateIsCurrentDayMinusOneBusinessDay(indDO.billingDate,"MM/dd/yyyy"))
    			invoice.invoiceNumber = (indDO.invoiceNumber);
    		invoice.ncaStatus = (indDO.ncaStatus);
    		invoice.pastDue = (indDO.pastDue);
    		invoice.paymentAmount=(this.returnZeroIfItIsNegativeAmount(indDO.paymentAmount));
    		invoice.premise = (commonUtilityHelper.getInvoicesAccountTypeForBilling(indDO.premise, req));
    		invoice.propertyUnit = (indDO.propertyUnit);
    		invoice.lastPaymentDate=(indDO.lastPaymentDate);
    		if(CAABPNumList.indexOf(indDO.bpNumber) >= 0){
    			cmnAreaInvoiceList.push(invoice);
    		}else if(NONCAABPNumList.indexOf(indDO.bpNumber) >= 0){
    			resInvoiceList.push(invoice);
    		}
    	});
    }catch(e){
      LoggerUtil.error("Error in getIndividualInvoicesFromResponse::::"+e.message)
    }
	  	LoggerUtil.info("THE RESDENTAIL INVOICES::::::::"+resInvoiceList.length);
    	LoggerUtil.info("THE COMMOM AREA INVOICES::::::::"+cmnAreaInvoiceList.length);
    	billInvoices.cmnAreaIndInvList = (cmnAreaInvoiceList);
    	billInvoices.resInvoiceList = (resInvoiceList);
    	billInvoices = this.setBillingInvoicesForResidentialAndCommonAreas(billInvoices,individualInvoices,resInvoiceList,cmnAreaInvoiceList,req);

    	return billInvoices;
	}

  private  setBillingInvoicesForResidentialAndCommonAreas( billInvoices:BillInvoices,individualInvoices:Array<IndividualInvoice> , resInvoiceList:Array<IndInvoice>, cmnAreaInvoiceList:Array<IndInvoice>,req:any ):BillInvoices{
    let commonUtilityHelper = new CommonUtilityHelper();
    try{
    	if(null != resInvoiceList && resInvoiceList.length > 0){
	    	let resInvoice = new IndividualInvoice();
	    	if(commonUtilityHelper.isBuilder(req)){
	    		resInvoice.accountType = (cst.HB_PREMISE_PREMISE_TYPE);
	    	}else{
	    		resInvoice.accountType = (cst.PM_VU_PREMISE_TYPE);
	    	}
	    	resInvoice.currentBalance= (this.calculateTotalBalanceAndPastDue(resInvoiceList, true));
	    	resInvoice.pastDue=(this.calculateTotalBalanceAndPastDue(resInvoiceList, false));
	    	individualInvoices.push(resInvoice);
    	}
    	if(null != cmnAreaInvoiceList && cmnAreaInvoiceList.length > 0){
	    	let cmnAreaInvoice = new IndividualInvoice();
	    	cmnAreaInvoice.accountType =(cst.BMF_CMN_PREMISE_TYPE);
	    	cmnAreaInvoice.currentBalance =(this.calculateTotalBalanceAndPastDue(cmnAreaInvoiceList, true));
	    	cmnAreaInvoice.pastDue =(this.calculateTotalBalanceAndPastDue(cmnAreaInvoiceList, false));
	    	individualInvoices.push(cmnAreaInvoice);
    	}
    	billInvoices.individualInvoices =(individualInvoices);
    }catch(e){
      LoggerUtil.error("Error in setBillingInvoicesForResidentialAndCommonAreas:::"+e.message)
    }
    	return billInvoices;
    }


private  calculateTotalBalanceAndPastDue(invoiceList:Array<IndInvoice> , isCurrentBal:boolean):string{

     let totalCurrentBalace = new bigDecimal(cst.DEFAULT_AMOUNT);
     let balance = new bigDecimal(cst.DEFAULT_AMOUNT);
     try{
         invoiceList.forEach((indDO:IndInvoice) =>{
           LoggerUtil.info("the current balace:::::::::::"+indDO.currentBalance);
           if(!CommonUtil.equalsIgnoreCase(indDO.ncaStatus, cst.STATUS_X_FLAG)){
             if(isCurrentBal)
               balance = new bigDecimal(indDO.currentBalance);
             else
               balance = new bigDecimal(indDO.pastDue);
             totalCurrentBalace = totalCurrentBalace.add(balance);
           }else{
             LoggerUtil.info("THIS CA HAS NCA FLAG X:::::NOT ADDING THIS CA AMOUNT TO TOTAL BALANCE::::");
           }
          LoggerUtil.info("the total current balace:::::::::::"+totalCurrentBalace);
         });
     }catch(e){
       LoggerUtil.error("Error in calculateTotalBalanceAndPastDue():::"+e.message)
     }

     return totalCurrentBalace.toString();
  }

  private  getBillingInvoicesIfNoARDetailsFoundOrNOStructuralDtlsFound( billInvoices:BillInvoices, response:any, req:any):BillInvoices{
  		try{
      		if(null != response && CommonUtil.equalsIgnoreCase(response.structuralDetailsFound, "y")){
      			LoggerUtil.info("FOUND STRUCTURAL DETAILS:::::BUT NO AR DETAILS FOUND FOR THE CONTRACT ACCOUNTS:::::");
          		let collContractAccList:Array<string> = (null !=response.collContractAccountList && response.collContractAccountList.length>0)?
          				(response.collContractAccountList):new Array<string>();
      			  let indContractAccList:Array<string> = (null !=response.indContractAccountList && response.indContractAccountList.length>0)?
          				 (response.indContractAccountList):new Array<string>();
          		billInvoices.noArBalanceCollAcountList = (collContractAccList);
          		billInvoices.noArBalanceIndAcountList = (indContractAccList);
          	}
      		billInvoices.structuralDetailsFound = (CommonUtil.equalsIgnoreCase(response.structuralDetailsFound, cst.YES));
          billInvoices.arDetailsFound = (CommonUtil.equalsIgnoreCase(response.arDetailsFound, cst.YES));

      }catch(e){
        LoggerUtil.error("Error in getBillingInvoicesIfNoARDetailsFoundOrNOStructuralDtlsFound():::"+e.message)
      }
      return billInvoices;
  	}


  public submitPayment(req:any):Promise<any>{
      let commonUtilityHelper = new CommonUtilityHelper();
      let emailHelper = new EmailHelper();
    	let paymentList = new Array<Payment>();
      paymentList = this.getPaymentList(req);
      let request:SubmitPaymentRequest = this.createSubmitPaymentRequest(req, paymentList);
      var p = new Promise((resolve, reject) => {
       this.billingService.submitPayment(request).then(s => {
         if(null != s && undefined !=s && s.dataAvilableForInput){
           paymentList = this.processSuccessPaymentListAfterSubmission(paymentList,s);
		       paymentList = this.processFailurePaymentListAfterSubmission(paymentList,s);
				  // emailHelper.sendPaymentConfirmEmail(req);
         }else{
           let errorMessage = "NUMBER OF PAYMENTS SUBMITTED:::"+paymentList.length;
     			 commonUtilityHelper.addExceptionToBMFSSSchema("BILLING_FE",errorMessage, errorMessage, req);
         }
         resolve(paymentList)
       });
      })
      return p;
		}

    private  createSubmitPaymentRequest(subpayvo:any,  paymentList:Array<Payment>):SubmitPaymentRequest{
 		let commonUtilityHelper = new CommonUtilityHelper();
 		let request1 = new SubmitPaymentRequest();
    try{
       		request1.strRelationshipId = (commonUtilityHelper.getSelectedPropertyRelationshipId(subpayvo));
       		request1.strLoggedInUserName = (commonUtilityHelper.getLoggedInUserName(subpayvo));
       		request1.addBankDetailsFlag = (subpayvo.body.addBankAcctFlag);
       		request1.strBankAccNumber = (subpayvo.body.bankAccountNum);
       		request1.strNickName = (subpayvo.body.nickName);
       		request1.strRoutingNumber = (subpayvo.body.routingNum);
       		request1.dueDate = (subpayvo.body.collective?subpayvo.body.collDueDate:subpayvo.body.indvDueDate);
       		let submitPayList = new Array<SubmitPaymentRequestDO>();
       		LoggerUtil.info("Payment is being submitted for the collective invoice:::::"+subpayvo.body.collContractAccount);
          paymentList.forEach((pay:Payment) => {
       			let request = new SubmitPaymentRequestDO();
       			request.strBankAccountNum = (pay.bankAccountNumber);
       			request.strBpNumber = (pay.partnerNumber);
       			request.strConractAccNum = (pay.contractAccountNumber);
       			request.strCurrentSts = (pay.currStatus);
       			request.strNickName = (pay.nickName);
       			request.strPaymentAmount = (pay.paymentAmount);
       			request.strPaymentDate = (pay.paymentDate);
       			request.strRoutingNum = (pay.routingNumber);
       			LoggerUtil.info("Payment is being submitted for the Individual invoice:::::"+pay.contractAccountNumber);
       			submitPayList.push(request);
       		});
 		    request1.submitPaymentRequestDOList = (submitPayList);
    }catch(e){
      LoggerUtil.error("Error in createSubmitPaymentRequest():::"+e.message);
    }
 		return request1;
 	 }

  private  getPaymentList(paymentVO:any):Array<Payment>{
		let paymentList = new Array<Payment>();
    try{
    		if(!paymentVO.collective){
          paymentVO.selectedCADtlList((indInv:IndInvoice) =>{
    				LoggerUtil.info("THE BPNUMBER AND CA FOR THIS PAYMENT IS::::"+indInv.bpNumber+"AND"+indInv.contractAccount+"::FOR:");
    				let payWS = new Payment();
    				//payWS.setBankAccountNumber(decodeBankAccNumber(paymentVO.getBankAccountNum()));
    				payWS.bankAccountNumber = (paymentVO.bankAccountNum);
    				payWS.contractAccountNumber = (indInv.contractAccount);
    				payWS.currStatus = (this.getPaymentStatus(paymentVO.indPaymentDate).toUpperCase());
    				payWS.nickName = (paymentVO.nickName);
    				payWS.partnerNumber=(indInv.bpNumber);
    				payWS.paymentAmount=(indInv.paymentAmount);
    				payWS.paymentDate = moment(paymentVO.indPaymentDate, cst.BILLPAY_DATE_FORMAT).toString();
    				payWS.routingNumber =(paymentVO.routingNum);
    				paymentList.push(payWS);
          });
    		}else{
    			LoggerUtil.info("Setting the payment object for the collective billing:::::");
    			let payWS = new Payment();
    			//payWS.setBankAccountNumber(decodeBankAccNumber(paymentVO.getBankAccountNum()));
    			payWS.bankAccountNumber = (paymentVO.bankAccountNum);
    			payWS.contractAccountNumber = (paymentVO.collContractAccount);
    			payWS.currStatus = (this.getPaymentStatus(paymentVO.collPaymentDate).toUpperCase());
    			payWS.nickName = (paymentVO.nickName);
    			payWS.partnerNumber=(paymentVO.bpNumber);
    			payWS.paymentAmount=(paymentVO.collPaymentAmount);
    			LoggerUtil.info("THE PAYMENT DATE::::::::::::"+paymentVO.collPaymentDate);
    			payWS.paymentDate=moment(paymentVO.collPaymentDate, cst.BILLPAY_DATE_FORMAT).toString();
    			payWS.routingNumber =(paymentVO.routingNum);
    			payWS.paymentID = ("");
    			paymentList.push(payWS);
    		}
    }catch(e){
      LoggerUtil.error("Error in getPaymentList()::: "+e.message)
    }

		return paymentList;

	}

  private getPaymentStatus( paymentDate:string):string{

		if(!(_.isEmpty(paymentDate))){
			if((moment(paymentDate, cst.BILLPAY_DATE_FORMAT).diff(moment.now())>0))
				return cst.PAYMENT_SCHEDULED;
			else
				return cst.PAYMENT_POSTED;
		}
		return "";
	}

  private processSuccessPaymentListAfterSubmission(paymentList:Array<Payment> , response:any):Array<Payment> {
  try{
     let submitSuccessList:Array<SubmitPayment> = (null != response.submitPaymentSuccessDOList && response.submitPaymentSuccessDOList.length >0)?
 				(response.submitPaymentSuccessDOList):new Array<SubmitPayment>();
    submitSuccessList.forEach((payresponse:SubmitPayment) =>{
      paymentList.forEach((pay:Payment) =>{
 				if(CommonUtil.equalsIgnoreCase(pay.contractAccountNumber, payresponse.contractAccount)){
 					LoggerUtil.info("THE SUCCESS STATUS MESSAGE:::"+payresponse.message+":::FOR::::"+payresponse.partner+":::AND::"+payresponse.contractAccount);
 					pay.message = (payresponse.message);
 					pay.confirmNum = (payresponse.confirmationNumber);
 				  pay.status = ((null != payresponse.status && CommonUtil.equalsIgnoreCase(payresponse.status, cst.STATUS_S_FLAG)));
 				}
 			});
 		});
  }catch(e){
    LoggerUtil.error("Error in processSuccessPaymentListAfterSubmission()::"+e.message);
  }
 		return paymentList;
 	}


 	private processFailurePaymentListAfterSubmission(paymentList:Array<Payment> ,response:any):Array<Payment> {
 		try{
   		 let submitFailureList:Array<SubmitPayment> = (null != response.submitPaymentFailureDOList && response.submitPaymentFailureDOList.length >0)?
   				(response.submitPaymentFailureDOList):new Array<SubmitPayment>();
        submitFailureList.forEach((payresponse:SubmitPayment) =>{
   		      paymentList.forEach((pay:Payment) =>{
         				if(CommonUtil.equalsIgnoreCase(pay.contractAccountNumber, payresponse.contractAccount)){
         					LoggerUtil.info("THE FAILURE STATUS MESSAGE:::"+payresponse.message+":::FOR::::"+payresponse.partner+":::AND::"+payresponse.contractAccount);
         					pay.message = (payresponse.message);
         					pay.confirmNum = (payresponse.confirmationNumber);
         				  pay.status = ((null != payresponse.status && CommonUtil.equalsIgnoreCase(payresponse.status, cst.STATUS_S_FLAG)));
         				}
   			});
   		});
    }catch(e){
      LoggerUtil.error("Error in processFailurePaymentListAfterSubmission()::::"+e.message);
    }
 		return paymentList;
 	}

  public getStoredBankDtls(req:any):Promise<any>{
    let strBankAccList = new Array<BankAccount>();
		let request:BankDetailsRequest = this.populateBankDetailsRequest(req);
    var p = new Promise((resolve, reject) => {
     this.billingService.getBankDetails(request).then(s => {
       strBankAccList = this.getStoredBankDetailsFromTheServiceList(s);
       resolve(strBankAccList)
     });
   });

   return p;

  }

  private  populateBankDetailsRequest(req:any):BankDetailsRequest{
		let commonUtilityHelper = new CommonUtilityHelper();
		let request = new BankDetailsRequest();
    try{
    		let relationshipId:string = commonUtilityHelper.getSelectedPropertyRelationshipId(req);
    		LoggerUtil.info("SLECTED PROPERTY RELATIONSHIP ID FOR THE STORED BANK DETAILS CALL::::"+relationshipId);
    		request.strCompanycode = (cst.GMESS_CC_0270);
    		request.strRelationshipId = (relationshipId);
    		request.strLoggedInUserName = (commonUtilityHelper.getLoggedInUserName(req));
    }catch(e){
    LoggerUtil.error("Error in populateBankDetailsRequest():::"+e.message)
   }
		return request;
	}

  private  getStoredBankDetailsFromTheServiceList(response:any):Array<BankAccount>{

	  let strBankAccList = new Array<BankAccount>();
    try{
		if(null != response && response.dataAvilableForInput){
			let bankAccountList:Array<BankDetailsDO> = (response.bankDetailsList);
			let dateList:Array<Date> = new Array<Date>();
      bankAccountList.forEach((bankAccount:BankDetailsDO) =>{
				let stBank = new BankAccount();
				stBank.bankAccountNum =(bankAccount.bankAccNumber);
				stBank.maskedBankAcc=(CommonUtil.maskNumber(bankAccount.bankAccNumber,3));
				stBank.bankRoutingNum = (bankAccount.routingNumber);
				stBank.bpnumber = (bankAccount.bpNumber);
				stBank.nickname = (bankAccount.nickName);
				stBank.storedDate = (bankAccount.lastUsed);
				dateList.push(moment(bankAccount.lastUsed, "yyyy-MM-dd").toDate());
				strBankAccList.push(stBank);
				strBankAccList = this.setLatestUsedStoredCard(strBankAccList, dateList);
			});
		}else{
			LoggerUtil.info("GOT THE NULL RESPONSE FROM THE SERVICE CALL:::::GETTING STORED BANK DETAILS FOR THE SELECTED PROPERTY::::");
		}
  }catch(e){
    LoggerUtil.error("Error in getStoredBankDetailsFromTheServiceList()::: "+e.message)
  }

		return strBankAccList;
	}

  private  setLatestUsedStoredCard(bankAccList:Array<BankAccount>, dateList:Array<Date> ):Array<BankAccount>{
		try{
  		let latestDate:Date = CommonUtil.getSoonestDueDate(dateList);
      bankAccList.forEach((ba:BankAccount) =>{
  			if(latestDate.getTime() === (moment(ba.storedDate, "yyyy-MM-dd").toDate().getTime())){
  				ba.selected = (true);
  			}
  		});
    }catch(e){
       LoggerUtil.error("Error in setLatestUsedStoredCard()::::"+e.message)
    }
		return bankAccList;
    }

  }
