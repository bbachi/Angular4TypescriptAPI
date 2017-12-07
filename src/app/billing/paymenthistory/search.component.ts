import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'payment-history-search',
    templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

    @Output() onApplyClick = new EventEmitter<any>();
    fromDate: Date = moment().toDate();
    toDate: Date = moment().toDate();
    accountNumber: string;
    @Input() contractAccountList: any;

    constructor() {}

    onApply(){
      let inVar = {fromDate:this.fromDate,toDate:this.toDate, contractAccountNumber:this.accountNumber}
      this.onApplyClick.emit(inVar)
    }

    onChangeAccountNumber(accountNum){
        this.accountNumber = accountNum;
    }

    ngOnInit() {

    }

}
