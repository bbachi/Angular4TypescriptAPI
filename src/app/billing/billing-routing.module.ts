import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentHistoryComponent, PreviousBillsComponent } from './index';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'paymenthistory.htm', component: PaymentHistoryComponent },
    { path: 'previousbills.htm', component: PreviousBillsComponent },
    { path: 'paybill', loadChildren: 'app/billing/paybill/paybill.module#PayBillModule'}
  ])],
  exports: [ RouterModule ]
})

export class BillingRoutingModule { }
