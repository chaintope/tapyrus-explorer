import { Pipe, PipeTransform } from '@angular/core';
import { Injectable } from '@angular/core';
import { Big } from 'big.js';

@Pipe({
  name: 'asTpc'
})
export class AsTpcPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return asTpc(value);
  }
}

function asTpc(value?: number): string {
  const valueAsBig = new Big(value || 0);
  return valueAsBig.div(100_000_000).toFixed(8);
}
