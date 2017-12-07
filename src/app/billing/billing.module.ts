import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { EffectsModule } from "@ngrx/effects";
import { PaymentHistoryComponent, PreviousBillsComponent, PaymentHistoryTableComponent, SearchComponent, PreviousBillsTableComponent, PreviousBillsSearchComponent } from './index';
import { BillingRoutingModule } from './billing-routing.module'
import { ReportsService } from '../_services/reports.service'
import { SharedModule } from '../shared/shared.module';
import { DatepickerModule } from 'angular2-material-datepicker'
import { BillingService } from '../_services/billing.service'
import { BillingEffects } from '../app-state/effects/billing.effects'

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        BillingRoutingModule,
        DatepickerModule,
        SharedModule,
        EffectsModule.forRoot([BillingEffects])
      ],
    declarations: [ PaymentHistoryComponent, PreviousBillsComponent, PaymentHistoryTableComponent, SearchComponent, PreviousBillsTableComponent, PreviousBillsSearchComponent ],
    exports: [ PaymentHistoryComponent, PreviousBillsComponent ],
    providers:[ BillingService ]
})
export class BillingModule { }
