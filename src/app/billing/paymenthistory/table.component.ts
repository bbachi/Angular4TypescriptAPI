import { Component, Input, Output, OnInit, EventEmitter  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
    selector: 'payment-history-table',
    templateUrl: './table.component.html',
    styles: ['a { cursor: pointer; }']
})
export class PaymentHistoryTableComponent implements OnInit {

    @Input() paymentHistoryList: any[];
    @Output() onCancelPaymentClick = new EventEmitter<any>();
    @Output() onModifyPaymentClick = new EventEmitter<any>();

    constructor() {}

    cancelPayment(accountNumber: string){
        this.paymentHistoryList.forEach(history => {
          if(history.accountNumber == accountNumber){
              this.onCancelPaymentClick.emit(history);
          }
        })
    }

    modifyPayment(accountNumber: string){
      this.paymentHistoryList.forEach(history => {
        if(history.accountNumber == accountNumber){
            this.onCancelPaymentClick.emit(history);
        }
      })
    }

    ngOnInit() {

    }

}
