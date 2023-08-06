import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentFromNowPipe } from '../pipes/moment-from-now.pipe';
import { AsTpcPipe } from '../pipes/as-tpc.pipe';
import { DateFormatPipe } from '../pipes/date-format.pipe';
@NgModule({
  declarations: [MomentFromNowPipe, AsTpcPipe, DateFormatPipe],
  imports: [CommonModule],
  exports: [MomentFromNowPipe, AsTpcPipe, DateFormatPipe]
})
export class SharedPipeModule {}
