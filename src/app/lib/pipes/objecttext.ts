import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../../services/common.service';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({ name: 'objecttext' })
export class ObjectTextPipe implements PipeTransform {
  constructor(public cms: CommonService) {

  }
  transform(value: any): string {
    return this.cms.getObjectText(value);
  }
}

@Pipe({ name: 'objectstext' })
export class ObjectsTextPipe implements PipeTransform {
  constructor(public cms: CommonService) {

  }
  transform(value: any[]): string {
    if (value && !Array.isArray(value)) {
      value = [value];
    }
    return value ? value.map(val => this.cms.getObjectText(val)).join(', ') : '';
  }
}
