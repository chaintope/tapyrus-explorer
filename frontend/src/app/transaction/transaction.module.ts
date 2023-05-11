import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedPipeModule } from '../modules/sharePipe.module';
import { TransactionPageRoutingModule } from './transaction-routing.module';
import { TransactionPage } from './transaction.page';
import { TransactionRawdataPage } from '../transaction-rawdata/transaction-rawdata.page';
import { TransactionRawdataPageModule } from '../transaction-rawdata/transaction-rawdata.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedPipeModule,
    TransactionPageRoutingModule,
    TransactionRawdataPageModule
  ],
  declarations: [TransactionPage],
  entryComponents: [TransactionRawdataPage]
})
export class TransactionPageModule {}
