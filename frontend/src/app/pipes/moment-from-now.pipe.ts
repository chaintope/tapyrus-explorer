import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Injectable } from '@angular/core';

@Injectable()
@Pipe({
  name: 'momentFromNow',
  pure: false
})
export class MomentFromNowPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (!value) {
      return '';
    }
    // * 1000 for secondsSinceEpoch
    return moment(
      new Date(value * 1000).toISOString(),
      moment.ISO_8601
    ).fromNow();
  }
}
