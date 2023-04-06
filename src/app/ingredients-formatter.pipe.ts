import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ingredientsFormatter'
})
export class IngredientsFormatterPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // if eggs are in the ingredients, make it a link to our eggs page
    let sampleRegEx: RegExp = /(eggs)/;
    let newValue = value.replace(sampleRegEx, "<a href='/#/veganref'>$1</a>");
    
    return newValue;
  }

}
