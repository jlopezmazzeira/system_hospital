import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { BreadcrumsComponent } from './breadcrums/breadcrums.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

// Pipes
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    PipesModule
  ],
  declarations: [
    HeaderComponent,
    BreadcrumsComponent,
    SidebarComponent,
    NopagefoundComponent
  ],
  exports: [
    HeaderComponent,
    BreadcrumsComponent,
    SidebarComponent,
    NopagefoundComponent
  ]

})

export class SharedModule { }
