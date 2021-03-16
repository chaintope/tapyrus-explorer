import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentFromNowPipe } from '../pipes/moment-from-now.pipe';
import { AsTpcPipe } from '../pipes/as-tpc.pipe';
@NgModule({
  declarations: [MomentFromNowPipe, AsTpcPipe],
  imports: [CommonModule],
  exports: [MomentFromNowPipe, AsTpcPipe]
})
export class SharedPipeModule {}
