import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedPipeModule } from '../modules/sharePipe.module';
import { TrackingValidationPageRoutingModule } from './tracking_validation-routing.module';
import { TrackingValidationPage } from './tracking_validation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedPipeModule,
    TrackingValidationPageRoutingModule
  ],
  declarations: [TrackingValidationPage]
})
export class TrackingValidationPageModule {}
