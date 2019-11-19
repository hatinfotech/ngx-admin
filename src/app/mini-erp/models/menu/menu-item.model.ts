export class MenuItemModel {

  Code?: string;
  Title: string;
  Icon?: string;
  Link?: string;
  Group?: boolean;
  Parent?: string;
  Childrend?: MenuItemModel[];

  constructor() { }

}
