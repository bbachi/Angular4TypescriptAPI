import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { EffectsModule } from "@ngrx/effects";
import { InvoicesComponent, IndividualInvoiceComponent, CollectiveInvoiceComponent } from './index';
import { PayBillRoutingModule } from './paybill-routing.module'
import { SharedModule } from '../../shared/shared.module';
import { DatepickerModule } from 'angular2-material-datepicker'
import { BillingService } from '../../_services/billing.service'
import { BillingEffects } from '../../app-state/effects/billing.effects'
import { PremiseTypePipe } from '../../_pipes/accounttype.pipe'

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        PayBillRoutingModule,
        DatepickerModule,
        SharedModule,
        EffectsModule.forRoot([BillingEffects])
      ],
    declarations: [
        InvoicesComponent,
        IndividualInvoiceComponent,
        CollectiveInvoiceComponent,
        PremiseTypePipe ],
    exports: [ InvoicesComponent ],
    providers:[ BillingService ]
})
export class PayBillModule { }
