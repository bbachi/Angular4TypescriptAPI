import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { EffectsModule } from "@ngrx/effects";
import { ConfirmPayComponent, VerifyPayComponent, StoredBankComponent } from './index';
import { PayBillCollectiveRoutingModule } from './collective-routing.module'
import { SharedModule } from '../../../shared/shared.module';
import { DatepickerModule } from 'angular2-material-datepicker'
import { BillingService } from '../../../_services/billing.service'
import { BillingEffects } from '../../../app-state/effects/billing.effects'

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        PayBillCollectiveRoutingModule,
        DatepickerModule,
        SharedModule,
        EffectsModule.forRoot([BillingEffects])
      ],
    declarations: [
        ConfirmPayComponent,
        VerifyPayComponent,
        StoredBankComponent,
        ],
    exports: [ ConfirmPayComponent, VerifyPayComponent, StoredBankComponent ],
    providers:[ BillingService ]
})
export class PayBillCollectiveModule { }
