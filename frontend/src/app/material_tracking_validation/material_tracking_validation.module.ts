import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedPipeModule } from '../modules/sharePipe.module';
import { MaterialTrackingValidationPageRoutingModule } from './material_tracking_validation-routing.module';
import { MaterialTrackingValidationPage } from './material_tracking_validation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedPipeModule,
    MaterialTrackingValidationPageRoutingModule
  ],
  declarations: [MaterialTrackingValidationPage]
})
export class MaterialTrackingValidationPageModule {}
