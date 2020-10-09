import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alpha'
})
export class AlphaPipe implements PipeTransform {

  transform(value: string): string {

      var newstr = '';
      // replace punctuation and spaces

      newstr = value.replace(/\W/g, '');
      newstr = newstr.replace(/[\s]/g, '');

      // make lowercase
      newstr = newstr.toLowerCase();

      return newstr;
  }

}