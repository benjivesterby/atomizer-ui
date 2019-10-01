import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component'
import { AtomsComponent } from 'src/app/atoms/atoms.component'



@NgModule({
  declarations: [
    DashboardComponent,
    AtomsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
  ]
})
export class AdminLayoutModule { }
