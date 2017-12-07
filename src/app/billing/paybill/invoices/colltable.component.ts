import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'collective-invoice-table',
    templateUrl: './colltable.component.html',
    styles: ['a{cursor:pointer;}']
    //styleUrls: ['./invoices.component.css']
})
export class CollectiveInvoiceComponent implements OnInit  {

    @Input() collectiveInvoices: any;
    @Output() onPayBillClick = new EventEmitter<any>();

    constructor(private router: Router) {}

    payBill(invoice:any){
        console.log(invoice)
        this.onPayBillClick.emit(invoice);
    }

    ngOnInit(){
        console.log("------------------")
        console.log(JSON.stringify(this.collectiveInvoices))
    }
}
