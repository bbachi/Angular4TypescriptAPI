import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'notprovided'})
export class NotProvidedPipe implements PipeTransform {
  transform(value: string): string {
    try{
      if(undefined != value && value.trim().length > 0){
        return value;
      }else{
        return 'Not Provided'
      }
    }catch(err){
        return 'Not Provided'
    }
  }
}
