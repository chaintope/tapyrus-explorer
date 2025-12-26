import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as timezone from 'moment-timezone';
import { Injectable } from '@angular/core';

@Injectable()
@Pipe({
  name: 'dateFormat',
  pure: false,
  standalone: false
})
export class DateFormatPipe implements PipeTransform {
  transform(time: any, ...args: any[]): any {
    if (!time) {
      return 'N/A';
    }
    return moment
      .unix(time)
      .tz(timezone.tz.guess())
      .format('X (MMM DD, yyyy HH:mm:ss z)');
  }
}
