import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class ReportsService {

    private vacancyReportUrl = '/portalAPI/reports/vacancy';
    private rollReportUrl = '/portalAPI/reports/roll';

    constructor(private http: Http) {

    }

    getVacancyReport(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.vacancyReportUrl, JSON.stringify(inData), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('Vacancy Report Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }

    getRollReport(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.rollReportUrl, JSON.stringify(inData), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('Roll Report Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    private handleError(error: Response) {
        console.log('Error with http request:::::' + error.json);
        return Observable.throw(error.json().error || 'Server error');
    }
}
