import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class ServiceStopService {

    private listPropertyAddressUrl = '/portalAPI/service/stop/addresses/list';
    private stopServiceSubmitUrl = '/portalAPI/service/stop/submit';

    constructor(private http: Http) {

    }

    listPropertyAddress(startDate: string, endDate: string): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = {startDate,endDate};
        return this.http.post(this.listPropertyAddressUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('Property Adddress list Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    submitStopService(submitReq:any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = submitReq;
        return this.http.post(this.stopServiceSubmitUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('Stop Service Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    private handleError(error: Response) {
        console.log('Error with http request:::::' + error.json);
        return Observable.throw(error.json().error || 'Server error');
    }
}
