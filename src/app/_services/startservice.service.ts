import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class ServiceStartService {

    private listPropertyAddressUrl = '/portalAPI/service/start/addresses/list';
    private startServiceSubmitUrl = '/portalAPI/service/start/submit';
    private planDetailsUrl = '/portalAPI/content/plan/details';
    private listPromocodesUrl = '/portalAPI/service/start/promocode/list';

    constructor(private http: Http) {

    }

    listPropertyAddress(esiidList: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = esiidList;
        return this.http.post(this.listPropertyAddressUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('list property address Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    submitStartService(submitReq:any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = submitReq;
        return this.http.post(this.startServiceSubmitUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('submit start service Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }

    getPlanDetails(promoCodeList: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.planDetailsUrl, JSON.stringify({promoCodeList}), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('plan details Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }

    getPromocodeList(relationshipId: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.listPromocodesUrl, JSON.stringify({relationshipId}), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('promocode list Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.log('Error with http request:::::' + error.json);
        return Observable.throw(error.json().error || 'Server error');
    }
}
