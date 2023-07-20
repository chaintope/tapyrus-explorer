import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackingValidationPage } from './tracking_validation.page';

const routes: Routes = [
  {
    path: '',
    component: TrackingValidationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingValidationPageRoutingModule {}
