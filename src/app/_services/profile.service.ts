import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class ProfileService {

    private userDtlsForTxnIdUrl = '/portalAPI/userdetails/txnid';
    private validateUserNameUrl = '/portalAPI/profile/user/username/validate';
    private saveUserUrl = '/portalAPI/profile/user/save';
    private listAssociatesUrl = '/portalAPI/profile/user/associates/list';
    private getUserProfileDetailsUrl = '/portalAPI/profile/user/details';
    private userUpdateUrl = '/portalAPI/profile/user/update';
    private searchUsersForUpdateUrl = '/portalAPI/profile/user/search';
    private firstTimeupdatePasswordUrl = '/portalAPI/profile/user/firsttime/updpassword';

    constructor(private http: Http) {

    }

    getUserDtlsForTxnId(transactionId: string): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = {transactionId};
        return this.http.post(this.userDtlsForTxnIdUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('user detail transaction Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }

    validateUserName(userName: string): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = {userName};
        return this.http.post(this.validateUserNameUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('validate user Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }

    saveUser(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.saveUserUrl, JSON.stringify(inData), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('validate user Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    listAssociates(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = inData;
        return this.http.post(this.listAssociatesUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('validate user Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    getUserProfileDetails(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.getUserProfileDetailsUrl, JSON.stringify(inData), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('get user profile details Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    updateUser(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = inData;
        return this.http.post(this.userUpdateUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('get user profile details Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    searchUsersForUpdate(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = inData;
        return this.http.post(this.searchUsersForUpdateUrl, JSON.stringify(body), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('get user profile details Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    updatePassword(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.firstTimeupdatePasswordUrl, JSON.stringify(inData), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('update passowrd Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }


    private handleError(error: Response) {
        console.log('Error with http request:::::' + error.json);
        return Observable.throw(error.json().error || 'Server error');
    }
}
