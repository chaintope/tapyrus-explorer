import { Pipe, PipeTransform } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable()
@Pipe({
  name: 'formatColorId',
  pure: false,
  standalone: false
})
export class FormatColorIdPipe implements PipeTransform {
  transform(colorId: any, ...args: any[]): any {
    if (
      colorId ===
      '000000000000000000000000000000000000000000000000000000000000000000'
    ) {
      return '(TPC)';
    } else {
      return colorId;
    }
  }
}
