import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class BillingService {

    private getPaymentHistoryUrl = '/portalAPI/billing/paymenthistory/list';
    private getPreviousBillsUrl = '/portalAPI/billing/previousbills/list';
    private getContractAccountListUrl = '/portalAPI/billing/contractaccount/list';
    private getInvoicesListUrl = '/portalAPI/billing/invoices/list';

    constructor(private http: Http) {

    }

    getPaymentHistory(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = inData;
        return this.http.post(this.getPaymentHistoryUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('payment history Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    getPreviousBills(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.getPreviousBillsUrl, JSON.stringify(inData), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('previous bills Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    getContractAccountList(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.getContractAccountListUrl, JSON.stringify(inData), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('contractaccount list Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    getBillingInvoiceList(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.getInvoicesListUrl, JSON.stringify(inData), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('billing invoices list Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    private handleError(error: Response) {
        console.log('Error with http request:::::' + error.json);
        return Observable.throw(error.json().error || 'Server error');
    }
}
