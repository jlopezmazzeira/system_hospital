import { NgModule } from '@angular/core';

//Modulos
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

//Rutas
import { PAGES_ROUTES } from './pages.routes';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [
  	PagesComponent,
  	DashboardComponent,
  	ProgressComponent,
  	Graficas1Component
  ],
  exports:[
  	PagesComponent,
  	DashboardComponent,
  	ProgressComponent,
  	Graficas1Component
  ],
  imports: [
  	SharedModule,
    PAGES_ROUTES,
    FormsModule
  ]

})

export class PagesModule{ }
