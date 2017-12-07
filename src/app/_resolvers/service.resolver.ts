import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ServiceStartService } from '../_services/startservice.service';
import { SharedService } from '../_services/shared.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app-state/reducers';
import * as selectedPropertyTypes from '../app-state/actions/selectedproperty'

@Injectable()
export class ServiceResolve implements Resolve<any> {

  startServiceData: string;
  constructor(private startService: ServiceStartService, private sharedService: SharedService, private store: Store<fromRoot.State>) {
      this.startServiceData = this.sharedService.getStartServiceData();
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any>|any {
      return this.startService.submitStartService(this.startServiceData);
  }

}
