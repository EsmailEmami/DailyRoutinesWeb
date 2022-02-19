import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'hideLength'
})
export class HideLengthPipe implements PipeTransform {

  transform(value: string, skip: number, take: number): string | null {
    if (value != null) {

      let replaceValue = [];

      for (let i = 0; i < take; i++) {
        replaceValue.push('*');
      }

      return value.replace(value.substr(skip, take), replaceValue.join(''));
    } else {
      return null;
    }
  }

}
