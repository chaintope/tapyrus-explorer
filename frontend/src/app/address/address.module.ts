import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressPageRoutingModule } from './address-routing.module';

import { AddressPage } from './address.page';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { SharedPipeModule } from '../modules/sharePipe.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressPageRoutingModule,
    SharedPipeModule,
    NgxPaginationModule,
    NgxQRCodeModule
  ],
  declarations: [AddressPage]
})
export class AddressPageModule {}
