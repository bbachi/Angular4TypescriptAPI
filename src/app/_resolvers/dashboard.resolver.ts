import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../_services/index';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app-state/reducers';
import * as selectedPropertyTypes from '../app-state/actions/selectedproperty'

@Injectable()
export class DashboardResolve implements Resolve<any> {

  relationshipId: string;
  constructor(private accountService: AccountService, private store: Store<fromRoot.State>) {
      this.store.select(fromRoot.getRelationshipId).subscribe(id => {
          this.relationshipId = id;
      });
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any>|any {
      return this.accountService.getCustomerDetails(this.relationshipId);
  }

}
