import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ceil',
  standalone: true
})
export class CeilPipe implements PipeTransform {
  transform(value: number, step: number = 1): number {
    return Math.ceil(value / step) * step;
  }
}
