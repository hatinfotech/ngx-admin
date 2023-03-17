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
@Pipe({name: 'objectid'})
export class ObjectIdPipe implements PipeTransform {
  constructor(public cms: CommonService) {

  }
  transform(value: string): string {
    return this.cms.getObjectId(value);
  }
}

@Pipe({name: 'objectsid'})
export class ObjectsIdPipe implements PipeTransform {
  constructor(public cms: CommonService) {

  }
  transform(value: any[]): string {
    return value ? value.map(val => this.cms.getObjectId(val)).join(', ') : '';
  }
}

