import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssetDashboardComponent } from './pages/asset-dashboard/asset-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AssetDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
