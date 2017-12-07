import { Component, Input, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app-state/reducers';
import * as previousbillsTypes from '../../app-state/actions/previousbills'
import * as billingTypes from '../../app-state/actions/billing'

@Component({
    templateUrl: './previousbills.component.html',
    styleUrls: ['./previousbills.component.css']
})
export class PreviousBillsComponent implements OnInit  {

    previousbills$: Observable<any[]>;
    contractAccountList$:Observable<any>;
    contractAccountList: any;
    csvName: string = "previousBills";
    propertyName$: Observable<any>;


    constructor(private store: Store<fromRoot.State>) {
        store.select(fromRoot.getNONCAARealBPList).subscribe(bpNumberList => {
            this.store.dispatch(new billingTypes.GetContractAccountList({bpNumberList}))
        });
    }

    onApply(inVar){
        let contractAccNumber = inVar.contractAccNumber;
        let accountType = inVar.accountType;
        this.getPreviousBills(contractAccNumber,accountType);
    }

    getPreviousBills(contractAccNumber,accountType){
        this.store.dispatch(new previousbillsTypes.GetPreviousBills({contractAccNumber, accountType}));
        this.previousbills$ = this.store.select(fromRoot.getPreviousBills);
    }

    ngOnInit() {
        this.contractAccountList$ = this.store.select(fromRoot.getContractAccountList);
        this.propertyName$ = this.store.select(fromRoot.getSelectedpropertyName);

        this.contractAccountList$.subscribe(contractAccList => {
            if(undefined != contractAccList){
              this.contractAccountList = contractAccList;
              if(contractAccList.indContractAccountList.length > 0){
                  let contractAccountNum = contractAccList.indContractAccountList[0].contractAccountNumber;
                  this.getPreviousBills(contractAccountNum,"I");
              }else{
                  let contractAccountNum = contractAccList.collContractAccountList[0].contractAccountNumber;
                  this.getPreviousBills(contractAccountNum,"C");
              }
            }
        })
      }

}
