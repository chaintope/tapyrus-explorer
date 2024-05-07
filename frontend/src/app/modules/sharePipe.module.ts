import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentFromNowPipe } from '../pipes/moment-from-now.pipe';
import { AsTpcPipe } from '../pipes/as-tpc.pipe';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { FormatColorIdPipe } from '../pipes/format-color-id.pipe';
@NgModule({
  declarations: [MomentFromNowPipe, AsTpcPipe, DateFormatPipe, FormatColorIdPipe],
  imports: [CommonModule],
  exports: [MomentFromNowPipe, AsTpcPipe, DateFormatPipe, FormatColorIdPipe]
})
export class SharedPipeModule {}
