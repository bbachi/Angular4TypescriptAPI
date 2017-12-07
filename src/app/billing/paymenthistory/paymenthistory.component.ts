import { Component, Input, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app-state/reducers';
import * as paymentHistoryTypes from '../../app-state/actions/paymenthistory'
import * as billingTypes from '../../app-state/actions/billing'

@Component({
    templateUrl: './paymenthistory.component.html',
    styleUrls: ['./paymenthistory.component.css']
})
export class PaymentHistoryComponent implements OnInit  {

    paymentHistory$: Observable<any[]>;
    csvName: string = "previousBills";
    propertyName$: Observable<any>;
    contractAccountList$:Observable<any>;


    constructor(private store: Store<fromRoot.State>) {
        store.select(fromRoot.getNONCAARealBPList).subscribe(bpNumberList => {
            this.store.dispatch(new billingTypes.GetContractAccountList({bpNumberList}))
        });
    }

    onCancelPayment(inData){
        console.log(inData)
    }

    onModifyPayment(inData){
      console.log(inData)
    }

    onApply(inVar){
        console.log(inVar);
        let contractAccNumber = inVar.contractAccountNumber;
        let startDate = inVar.startDate;
        let endDate = inVar.endDate;
        this.getPaymentHistory(contractAccNumber,startDate,endDate);
    }

    getPaymentHistory(contractAccNumber,startDate,endDate){
        this.store.dispatch(new paymentHistoryTypes.GetPaymentHistory({contractAccNumber,startDate,endDate}));
        this.paymentHistory$ = this.store.select(fromRoot.getPaymentHistoryList);
    }

    ngOnInit() {
        this.contractAccountList$ = this.store.select(fromRoot.getContractAccountList);
        this.propertyName$ = this.store.select(fromRoot.getSelectedpropertyName);

        this.getPaymentHistory("","","");
    }

}
