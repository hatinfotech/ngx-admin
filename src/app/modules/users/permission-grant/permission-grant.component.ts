import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserGroupModel } from '../../../models/user-group.model';

@Component({
  selector: 'ngx-permission-grant',
  templateUrl: './permission-grant.component.html',
  styleUrls: ['./permission-grant.component.scss'],
})
export class PermissionGrantComponent implements OnInit {

  nodes = [
    {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' },
        { id: 3, name: 'child2' },
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ],
        }
      ],
    },
  ];
  options = {};

  userGroups = [];

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) {
    this.apiService.get<UserGroupModel[]>('/user/groups', { limit: 999999, includeUsers: true },
      list => this.userGroups = list.map((item: {
        id: string,
        name: string,
        Code: string,
        Name: string,
        children: {
          id: string,
          name: string,
        }[], Users: [],
      }) => {
        // item['id'] = item['Code'];
        item.id = item.Code;
        // item['name'] = item['Name'];
        item.name = item.Name;
        if (item.Users) {
          item.children = [];
          item.Users.forEach((element: { Code: string, Name: string }) => {
            item.children.push({
              id: element.Code,
              name: element.Name,
            });
          });
          delete item.Users;
        }
        return item;
      }));
  }

  ngOnInit() {
  }

}
