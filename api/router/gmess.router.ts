import {Router, Request, Response, NextFunction} from 'express';
import LoggerUtil from '../logs/log';
import { PreLoginController } from '../controller/prelogin.controller';
import { TransactionsController } from '../controller/transactions.controller'
import { ReportsController } from '../controller/reports.controller'
import { FormsController } from '../controller/forms.controller'
import { MyAccountController } from '../controller/myaccount.controller'
import { ProfileController } from '../controller/profile.controller'
import { StartServiceController } from '../controller/startservice.controller'
import { StopServiceController } from '../controller/stopservice.controller'
import { VUMController } from '../controller/vum.controller'
import { BillingController } from '../controller/billing.controller'
import { ContentController } from '../controller/content.controller'


export class GMESSRouter {

     router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        var preloginController = new PreLoginController();
        var transactionsController = new TransactionsController();
        var reportsController = new ReportsController();
        var formsController = new FormsController();
        var myAccountController = new MyAccountController();
        var profileController = new ProfileController();
        var startserviceController = new StartServiceController();
        var stopServiceController = new StopServiceController();
        var vumController = new VUMController();
        var billingController = new BillingController();
        var contentController = new ContentController();

        this.router.get('/get', preloginController.testget);

        /* Prelogin calls start */
        this.router.post('/prelogin/firstlogin/get', preloginController.getFirstLogonFlag);
        this.router.post('/prelogin/firstlogin/set', preloginController.setFirstLogonFlag);
        this.router.post('/prelogin/user/details', preloginController.getUserProfileDetails);
        this.router.post('/prelogin/search/bpnumber', preloginController.searchByBpNumber)
        /* Prelogin calls end */

        /* Transactions calls start */
        this.router.post('/transactions/list', transactionsController.listTransactions);
        this.router.post('/transactions/detail', transactionsController.detailTransaction);
        /* Transactions calls end */

        /* Reports calls start */
        this.router.post('/reports/vacancy', reportsController.vacancyReport);
        this.router.post('/reports/roll', reportsController.rollReport);
        /* Reports calls end */

        /* Forms calls start */
        this.router.post('/forms/list', formsController.getGMEForms);
        //this.router.post('/reports/roll', reportsController.rollReport);
        /* Forms calls end */

        /* MyAccount calls start */
        this.router.post('/dashboard/custdtls', myAccountController.getCustomerDetails);
        this.router.post('/multifamily/noncaa/esiid/list', myAccountController.getMFESIIDListForNONCAABPList);
        /* MyAccount calls end */

        /* Start service calls start */
        this.router.post('/service/start/addresses/list', startserviceController.listPropertyAddress);
        this.router.post('/service/start/submit', startserviceController.startServiceSubmit);
        this.router.post('/service/start/promocode/list',startserviceController.getpromoCodeDetails)
        /* Start service calls stop */

        /* Stop service calls start */
        this.router.post('/service/stop/addresses/list', stopServiceController.listPropertyAddress);
        this.router.post('/service/stop/submit', stopServiceController.stopServiceSubmit);
        /* Stop service calls stop */

        /* VUM calls start */
        this.router.post('/vum/vacant/dailyreport', vumController.getVacantDailyReport);
        /* VUM calls end */

        /* Billing calls start */
        this.router.post('/billing/paymenthistory/list', billingController.getPaymentHistory);
        this.router.post('/billing/previousbills/list', billingController.getPreviousBills);
        this.router.post('/billing/contractaccount/list', billingController.getContractAccountList);
        this.router.post('/billing/invoices/list', billingController.getBillingDetails);
        /* Billing calls end */

        /* Profile Management calls start */
        this.router.post('/userdetails/txnid', profileController.getUserDetailsForTxnId);
        this.router.post('/profile/user/save', profileController.saveUser);
        this.router.post('/profile/user/username/validate', profileController.validateUserName);
        this.router.post('/profile/user/associates/list', profileController.listAssociates);
        this.router.post('/profile/user/details', profileController.getUserDetails);
        this.router.post('/profile/user/firsttime/updpassword', profileController.setupPasswordFirstTime)
        this.router.post('/profile/user/update', profileController.updateUser)
        this.router.post('/profile/user/search', profileController.searchUsersForUpdate)
        /* Profile Management calls end */

        /* Content calls Start */
        this.router.post('/content/plan/details', contentController.getPlanDetails);
        this.router.post('/content/faqs', contentController.getFAQs);
        this.router.post('/content/message', contentController.getMessageContentByTitle);
        /* Content calls End */
    }

}
