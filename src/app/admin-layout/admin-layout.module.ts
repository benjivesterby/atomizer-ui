import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component'
import { AtomsComponent } from 'src/app/atoms/atoms.component'
import { NotifierModule } from "angular-notifier";




@NgModule({
  declarations: [
    DashboardComponent,
    AtomsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: "middle",
          distance: 12
        },
        vertical: {
          position: "top",
          distance: 12,
          gap: 10
        }
      },
      behaviour: {
        autoHide: 2500,
        onClick: false,
        onMouseover: "pauseAutoHide",
        showDismissButton: true,
        stacking: 4
      },
    }),
  ]
})
export class AdminLayoutModule { }
