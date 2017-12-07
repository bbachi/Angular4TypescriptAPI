import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent }  from './app.component';
import { HomeComponent, LoginHeaderComponent, LoginFooterComponent } from './home/index';
import { PreLoginComponent } from './prelogin/prelogin.component'
import { TermsOfUseComponent, TermsOfUseLayout } from './termsofuse/index';
//feature module imports
import { SharedModule } from './shared/shared.module';
import { SelectAccountModule } from './selectaccount/selectaccount.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { MFStartServiceModule } from './service/multifamily/startservice/startservice.module'
import { MFStopServiceModule } from './service/multifamily/stopservice/stopservice.module'
import { TransactionsModule } from './transactions/transactions.module'
import { ReportsModule } from './reports/reports.module'
import { SSFormsModule } from './forms/forms.module'
import { PublicModule } from './public/public.module'
import { MonitoringModule } from './monitoring/monitoring.module'
import { environment } from '../environments/environment';
//routing module
import { AppRoutingModule } from './app.router.module'

//services
import { UserService, SharedService } from './_services/index'

//state related imports
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, metaReducers } from "./app-state/reducers";
import { CustomRouterStateSerializer } from './app-state/shared/utils';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';


@NgModule({
  imports: [BrowserModule,
            FormsModule,
            ReactiveFormsModule,
            HttpModule,
            AppRoutingModule,
            SharedModule,
            SelectAccountModule,
            DashboardModule,
            MFStartServiceModule,
            MFStopServiceModule,
            TransactionsModule,
            ReportsModule,
            SSFormsModule,
            PublicModule,
            MonitoringModule,

          /**
           * StoreModule.forRoot is imported once in the root module, accepting a reducer
           * function or object map of reducer functions. If passed an object of
           * reducers, combineReducers will be run creating your application
           * meta-reducer. This returns all providers for an @ngrx/store
           * based application.
           */
           StoreModule.forRoot(reducers, { metaReducers }),

           /**
           * @ngrx/router-store keeps router state up-to-date in the store.
           */
           StoreRouterConnectingModule,

           /**
           * Store devtools instrument the store retaining past versions of state
           * and recalculating new states. This enables powerful time-travel
           * debugging.
           *
           * To use the debugger, install the Redux Devtools extension for either
           * Chrome or Firefox
           *
           * See: https://github.com/zalmoxisus/redux-devtools-extension
           */
           !environment.production ? StoreDevtoolsModule.instrument() : [],

           /**
           * EffectsModule.forRoot() is imported once in the root module and
           * sets up the effects class to be initialized immediately when the
           * application starts.
           *
           * See: https://github.com/ngrx/platform/blob/master/docs/effects/api.md#forroot
           */
          ],
  declarations: [
        AppComponent,
        HomeComponent,
        PreLoginComponent,
        TermsOfUseComponent,
        LoginHeaderComponent,
        LoginFooterComponent,
        TermsOfUseLayout ],
  bootstrap: [ AppComponent ],
  providers: [
    /**
    * The `RouterStateSnapshot` provided by the `Router` is a large complex structure.
    * A custom RouterStateSerializer is used to parse the `RouterStateSnapshot` provided
    * by `@ngrx/router-store` to include only the desired pieces of the snapshot.
    */
   { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
   UserService, SharedService ]
})
export class AppModule { }
