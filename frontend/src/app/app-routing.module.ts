import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BookingsComponent } from './pages/bookings/bookings.component';
import { ContractsComponent } from './pages/contracts/contracts.component';

const routes: Routes = [
  { path: 'bookings', component: BookingsComponent },
  { path: 'contracts', component: ContractsComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}