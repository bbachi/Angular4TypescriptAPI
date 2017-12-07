import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'individual-invoice-table',
    templateUrl: './indtable.component.html',
    styles: ['a{cursor:pointer;}']
    //styleUrls: ['./invoices.component.css']
})
export class IndividualInvoiceComponent implements OnInit  {

    @Input() individualInvoices: any;
    @Output() onPayBillClick = new EventEmitter<any>();

    constructor(private router: Router) {
    }

    payBill(invoice:any){
        console.log(invoice)
        this.onPayBillClick.emit(invoice);
    }

    ngOnInit(){
    }
}
