import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideNumber'
})
export class HideNumberPipe implements PipeTransform {

  transform(value: string): string | null {
    if (value != null) {
      return value.replace(value.substr(4, 3), "***");
    } else {
      return null;
    }
  }

}
