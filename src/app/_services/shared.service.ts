import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class SharedService {

    private relationshipId: string;
    private userDetails: any;
    private selectedpropertyDtls = new Subject<any>();
    private webSecurityRole = new Subject<any>();
    private startServiceData: any;
    private messageContentsUrl = '/portalAPI/content/message';



    setSelectedpopertyRelationshipId(relationshipId: string){
        this.relationshipId = relationshipId;
    }

    getStartServiceData(){
        return this.startServiceData;
    }

    setStartServiceData(data: any){
        this.startServiceData = data;
    }

    getLoggedInUserDetails(){
        return this.userDetails;
    }

    setLoggedInUserDetails(userDetails: any){
        this.userDetails = userDetails;
    }

    getSelectedpopertyRelationshipId(){
        return this.relationshipId;
    }

    setSelectedPropertyDtls(property: any){
        this.selectedpropertyDtls.next(property);
    }

    getSelectedPropertyDtls(): Observable<any>{
        return this.selectedpropertyDtls.asObservable();
    }

    constructor(private http: Http) {

    }

    getMessageContent(inData: any): Observable<any> {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.messageContentsUrl, JSON.stringify(inData), options)
            .map((response: Response) => <any> response.json())
            .do(data => {console.log('message content Response' + JSON.stringify(data));})
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.log('Error with http request:::::' + error.json);
        return Observable.throw(error.json().error || 'Server error');
    }
}
