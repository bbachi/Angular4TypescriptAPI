import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicesComponent } from './index';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'viewbill.htm', component: InvoicesComponent },
    { path: 'collective', loadChildren: 'app/billing/paybill/collective/collective.module#PayBillCollectiveModule'},
    { path: 'individual', loadChildren: 'app/billing/paybill/individual/individual.module#PayBillIndividualModule'}
  ])],
  exports: [ RouterModule ]
})

export class PayBillRoutingModule { }
