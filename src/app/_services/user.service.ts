import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {

    private getFirstLognFlagUrl = '/portalAPI/prelogin/firstlogin/get';
    private setFirstLognFlagUrl = '/portalAPI/prelogin/firstlogin/set';
    private getUserProfileUrl = "/portalAPI/prelogin/user/details";

    constructor(private http: Http) {

    }

    getFirstLogonFlag(userName: string): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = {userName};
        return this.http.post(this.getFirstLognFlagUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('get first logon flag Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }

    setFirstLogonFlag(userName: string): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = {userName};
        return this.http.post(this.setFirstLognFlagUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('set first logon flag Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }

    getUserProfile(userName: string): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = {userName};
        return this.http.post(this.getUserProfileUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('set first logon flag Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }



    private handleError(error: Response) {
        console.log('Error with http request:::::' + error.json);
        return Observable.throw(error.json().error || 'Server error');
    }
}
