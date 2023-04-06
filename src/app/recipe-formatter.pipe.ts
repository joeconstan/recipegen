import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recipeFormatter'
})
export class RecipeFormatterPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    
    // if a temperature has been included, bold it
    let sampleRegEx: RegExp = /(\d{3}(F|C|f|c| F| C| f| c|\s|\sdegrees|°))/;
    let newValue = value.replace(sampleRegEx, "<b>$1</b>");
    
    return newValue;

  }

}
