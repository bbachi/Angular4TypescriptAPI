import {Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'gme-app',
    styleUrls: ['./app.component.css'],
    template: `<router-outlet></router-outlet>`,
    encapsulation: ViewEncapsulation.Emulated,
    providers: []
})
export class AppComponent { }
