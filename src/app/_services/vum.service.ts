import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class VUMService {

    private getDailyReportUrl = '/portalAPI/vum/vacant/dailyreport';

    constructor(private http: Http) {

    }

    getVacantDailyReport(inData: string): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.getDailyReportUrl, JSON.stringify(inData), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('transactions list Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    private handleError(error: Response) {
        console.log('Error with http request:::::' + error.json);
        return Observable.throw(error.json().error || 'Server error');
    }
}
