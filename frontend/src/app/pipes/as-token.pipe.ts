import { Pipe, PipeTransform } from '@angular/core';
import { Big } from 'big.js';

@Pipe({
  name: 'asToken',
  standalone: false
})
export class AsTokenPipe implements PipeTransform {
  transform(value: any, decimals?: number): string {
    if (decimals === undefined || decimals === null || decimals === 0) {
      return String(value || 0);
    }
    const valueAsBig = new Big(value || 0);
    const divisor = Math.pow(10, decimals);
    return valueAsBig.div(divisor).toFixed(decimals);
  }
}
