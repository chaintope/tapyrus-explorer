import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionsPageRoutingModule } from './transactions-routing.module';

import { TransactionsPage } from './transactions.page';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedPipeModule } from '../modules/sharePipe.module';

import { TransactionsModalPage } from '../transactions-modal/transactions-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionsPageRoutingModule,
    SharedPipeModule,
    NgxPaginationModule
  ],
  declarations: [TransactionsPage, TransactionsModalPage],
  entryComponents: [TransactionsModalPage]
})
export class TransactionsPageModule {}
