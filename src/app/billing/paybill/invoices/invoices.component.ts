import { Component, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app-state/reducers';
import * as billingTypes from '../../../app-state/actions/billing'

@Component({
    templateUrl: './invoices.component.html',
    styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit  {


    invoices$: Observable<any>;
    propertyName$: Observable<any>;

    constructor(private router: Router, private store: Store<fromRoot.State>) {
        this.invoices$ = this.store.select(fromRoot.getBillingInvoices);
    }

    onPayBill(invoice,invoiceType){
        if(invoiceType == 'C'){
            this.router.navigate(['/customer/billing/paybill/collective/paymentmethod.htm'])
        }else{
            this.router.navigate(['/customer/billing/paybill/individual/paymentmethod.htm'])
        }
    }

    ngOnInit(){
        this.store.dispatch(new billingTypes.GetBillingInvoiceList({}));
        this.propertyName$ = this.store.select(fromRoot.getSelectedpropertyName);
    }
}
