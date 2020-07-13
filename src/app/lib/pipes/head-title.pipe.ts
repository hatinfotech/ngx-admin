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
@Pipe({name: 'headtitlecase'})
export class HeadTitlePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/^./, value.charAt(0).toUpperCase());
  }
}
