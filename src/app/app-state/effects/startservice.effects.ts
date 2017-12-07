import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';
import { of } from 'rxjs/observable/of';
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceStartService } from '../../_services/startservice.service';
import { ServiceStopService } from '../../_services/stopservice.service';
import * as startservice from '../actions/startservice';

@Injectable()
export class StartServiceEffects {

  constructor(private action$: Actions, private startService: ServiceStartService, private stopService: ServiceStopService) { }

  @Effect()
  propertyAddressEffects$ = this.action$.ofType(startservice.LIST_PROPERTY_ADDRESS)
    .map(toPayload)
    .switchMap((payload) => this.startService.listPropertyAddress(payload)
    .map((addresses) => {
        return new startservice.ListPropertyAddressesSuccess(addresses)
    }))
    .catch(() => Observable.of(new startservice.ListPropertyAddressesFailure({})))


  @Effect()
  submitStartServiceEffects$ = this.action$.ofType(startservice.SUBMIT_START_SERVICE)
    .map(toPayload)
    .switchMap((payload) => this.startService.submitStartService(payload)
    .map((result) => {
        return new startservice.SubmitStartServiceSuccess(result)
    }))
    .catch(() => Observable.of(new startservice.SubmitStartServiceFailure({})))


  @Effect()
  submitStopServiceEffects$ = this.action$.ofType(startservice.SUBMIT_STOP_SERVICE)
    .map(toPayload)
    .switchMap((payload) => this.stopService.submitStopService(payload)
    .map((result) => {
        return new startservice.SubmitStopServiceSuccess(result)
    }))
    .catch(() => Observable.of(new startservice.SubmitStopServiceFailure({})))

}
