import { Component, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../app-state/reducers';
import * as billingTypes from '../../../../app-state/actions/billing'

@Component({
    templateUrl: './storedbank.component.html',
    styleUrls: ['./storedbank.component.css']
})
export class StoredBankComponent {

    constructor(private router: Router){}

    onContinue(){
        this.router.navigate(['/customer/billing/paybill/collective/verify.htm'])
    }
}
