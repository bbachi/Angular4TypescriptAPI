import { Component, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../app-state/reducers';
import * as billingTypes from '../../../../app-state/actions/billing'

@Component({
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.css']
})
export class VerifyPayComponent {

  constructor(private router: Router){}

  onContinue(){
      this.router.navigate(['/customer/billing/paybill/collective/confirm.htm'])
  }
}
