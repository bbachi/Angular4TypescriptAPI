import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { FormsService } from '../_services/forms.service';

@Injectable()
export class FormsResolve implements Resolve<any> {

  constructor(private formsService: FormsService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.formsService.listForms()
  }
}
