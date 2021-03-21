import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlockPageRoutingModule } from './block-routing.module';

import { BlockPage } from './block.page';
import { BlockRawdataPage } from '../block-rawdata/block-rawdata.page';
import { SharedPipeModule } from '../modules/sharePipe.module';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlockPageRoutingModule,
    NgxPaginationModule,
    SharedPipeModule
  ],
  declarations: [BlockPage, BlockRawdataPage],
  entryComponents: [BlockRawdataPage]
})
export class BlockPageModule {}
