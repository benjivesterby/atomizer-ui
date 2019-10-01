import { Routes } from '@angular/router';

import { DashboardComponent } from 'src/app/dashboard/dashboard.component'
import { AtomsComponent } from 'src/app/atoms/atoms.component'

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'atoms',      component: AtomsComponent },
];
