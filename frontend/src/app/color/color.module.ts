import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColorPageRoutingModule } from './color-routing.module';

import { ColorPage } from './color.page';
import { SharedPipeModule } from '../modules/sharePipe.module';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColorPageRoutingModule,
    NgxPaginationModule,
    SharedPipeModule
  ],
  declarations: [ColorPage],
  entryComponents: []
})
export class ColorPageModule {}
