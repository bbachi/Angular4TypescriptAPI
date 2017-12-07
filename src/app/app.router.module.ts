import { NgModule } from '@angular/core';
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PreLoginComponent } from './prelogin/prelogin.component';
import { TermsOfUseComponent, TermsOfUseLayout } from './termsofuse/index';

export const routes: Routes = [
  { path: 'home.htm', component: HomeComponent},
  { path: 'prelogin.htm/:userName', component: PreLoginComponent},
  { path: 'termsofuse.htm', component: TermsOfUseLayout, children: [{path: ':userName', component: TermsOfUseComponent},]},
  { path: 'selectaccount', loadChildren: 'app/selectaccount/selectaccount.module#SelectAccountModule' },
  { path: 'customer', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' },
  { path: 'public', loadChildren: 'app/public/public.module#PublicModule' },
  { path: '',  redirectTo: '/home.htm', pathMatch: 'full' },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
