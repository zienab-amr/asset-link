import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'maintenance-schedule',
    loadChildren: () => import('./pages/maintenance-schedule/maintenance-schedule.module').then(m => m.MaintenanceScheduleModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
