import { ComponentModel } from './component.model';
import { ResourceModel } from './resource.model';

export class ModuleModel {

  Name?: string;
  Description?: string;
  Components?: ComponentModel[];
  Resources?: ResourceModel[];

  constructor() { }

}
