import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColorsPageRoutingModule } from './colors-routing.module';

import { ColorsPage } from './colors.page';
import { SharedPipeModule } from '../modules/sharePipe.module';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColorsPageRoutingModule,
    NgxPaginationModule,
    SharedPipeModule
  ],
  declarations: [ColorsPage]
})
export class ColorsPageModule {}
