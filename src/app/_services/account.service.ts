import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class AccountService {

    private searchByBpNumberUrl = '/portalAPI/prelogin/search/bpnumber';
    private customerDtlsUrl = '/portalAPI/dashboard/custdtls';
    private listESIIDListUrl = '/portalAPI/multifamily/noncaa/esiid/list';

    private relationshipId: string;

    setSelectedpopertyRelationshipId(relationshipId: string){
      this.relationshipId = relationshipId;
    }

    constructor(private http: Http) {

    }

    searchByBpNumber(bpNumber: string): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = {bpNumber};
        return this.http.post(this.searchByBpNumberUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('search by bp Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }

    getCustomerDetails(relationshipId:string): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = {relationshipId};
        return this.http.post(this.customerDtlsUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('get customer details Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    listESIIDs(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = inData;
        return this.http.post(this.listESIIDListUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('forms list Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    private handleError(error: Response) {
        console.log('Error with http request:::::' + error.json);
        return Observable.throw(error.json().error || 'Server error');
    }
}
