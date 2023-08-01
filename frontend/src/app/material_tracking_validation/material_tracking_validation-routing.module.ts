import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialTrackingValidationPage } from './material_tracking_validation.page';

const routes: Routes = [
  {
    path: '',
    component: MaterialTrackingValidationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialTrackingValidationPageRoutingModule {}
