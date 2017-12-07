import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmPayComponent, VerifyPayComponent, StoredBankComponent } from './index';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'paymentmethod.htm', component: StoredBankComponent },
    { path: 'verify.htm', component: VerifyPayComponent },
    { path: 'confirm.htm', component: ConfirmPayComponent },
  ])],
  exports: [ RouterModule ]
})

export class PayBillIndividualRoutingModule { }
