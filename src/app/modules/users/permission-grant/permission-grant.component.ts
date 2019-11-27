import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserGroupModel } from '../../../models/user-group.model';
import { MenuItemModel } from '../../../models/menu-item.model';
import { TreeComponent, ITreeState } from 'angular-tree-component';
import { PermissionEntryModel } from '../../../models/permission-entry.model';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { ShowcaseDialogComponent } from '../../dialog/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-permission-grant',
  templateUrl: './permission-grant.component.html',
  styleUrls: ['./permission-grant.component.scss'],
})
export class PermissionGrantComponent implements OnInit, OnDestroy {
  options = {};

  userGroups = [];
  menuTree = [];
  permissionList: { [key: string]: PermissionEntryModel[] };
  menuItemPermissionList: PermissionEntryModel[];

  userTreeState: ITreeState;
  menuTreeState: ITreeState;

  currentUserNode: { id: string, name: string, type: string };
  currentMenuNode: { id: string, name: string, type: string };

  permissionForm: FormGroup;

  /** Destroy monitoring */
  destroy$: Subject<null> = new Subject<null>();

  allowUpdatePermission = false;

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
  ) {

    this.permissionForm = this.formBuilder.group({
      array: this.formBuilder.array([]),
    });

    this.apiService.get<UserGroupModel[]>('/user/groups', { limit: 999999, includeUsers: true, selectUsers: 'id=>Code,name=>Name,type=>Type', isTree: true, select: 'id=>Code,name=>Description,children=>Children,type=>Type' },
      list => {
        this.userGroups = list;
      });

    this.apiService.get<MenuItemModel[]>('/menu/menu-items', { limit: 999999, isTree: true, includeUsers: true, select: 'id=>Code,name=>Title,children=>Children' }, list => {
      this.menuTree = list;
    });

  }

  ngOnInit() {
  }

  get allowResetPermission() {
    return this.currentUserNode && this.currentUserNode.id && this.currentMenuNode && this.currentMenuNode.id;
  }

  get permissionFormArray(): FormArray {
    return this.permissionForm.get('array') as FormArray;
  }

  treeFilter(text: string, tree: TreeComponent) {
    this.commonService.takeUntil('permission_filter', 500, () => {
      tree.treeModel.filterNodes((node: { data: { name: string } }) => {
        if (!node.data.name) {
          return false;
        }
        return this.commonService.smartFilter(node.data.name, text);
      });
    });

  }

  onUserTreeNodeForce(event: { node: { data: { id: string, name: string, type: string } } }) {
    if (this.currentUserNode && this.currentUserNode.id !== event.node.data.id) {
      this.onChangeTreeNode();
      this.currentUserNode = event.node.data;
      this.onTreeNodeForce();
      return;
    }
    this.currentUserNode = event.node.data;
    this.onTreeNodeForce();
  }

  onMenuTreeNodeForce(event: { node: { data: { id: string, name: string, type: string } } }) {
    if (this.currentMenuNode && this.currentMenuNode.id !== event.node.data.id) {
      this.onChangeTreeNode();
      this.currentMenuNode = event.node.data;
      this.onTreeNodeForce();
      return;
    }
    this.currentMenuNode = event.node.data;
    this.onTreeNodeForce();
  }

  onTreeNodeForce(): false {
    this.loadPermission();
    return false;
  }

  loadPermission() {

    if (this.currentUserNode && this.currentUserNode.id && this.currentMenuNode && this.currentMenuNode.id) {
      this.allowUpdatePermission = false;
      let group = '';
      let user = '';
      const menuItem = this.currentMenuNode.id;

      if (this.currentUserNode.type === 'GROUP') {
        group = this.currentUserNode.id;
      }
      if (this.currentUserNode.type === 'USER') {
        user = this.currentUserNode.id;
      }

      this.apiService.get<PermissionEntryModel[]>('/user/permissions', {
        Group: group,
        User: user,
        MenuItem: menuItem,
      }, (result) => {
        console.info(result);
        this.permissionFormArray.clear();
        result.forEach(element => {
          const newPermissionFormItem = this.formBuilder.group({
            Permission: '',
            Description: '',
            Status: '',
          });

          newPermissionFormItem.patchValue(element);
          this.permissionFormArray.push(newPermissionFormItem);
        });
      });
    }
  }

  onChangeTreeNode() {
    if (this.allowUpdatePermission) {
      this.updatePermission();
    }
  }

  onPermissionUpdateButtonClick(): false {
    this.updatePermission();
    return false;
  }

  onPermissionResetButtonClick(): false {
    this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: 'Xác nhận đặt lại phân quyền',
        content: 'Các phân quyền của nhóm và người dùng trong nhóm cũng sẽ bị đặt lại, bạn có muốn đặt lại không ?',
        actions: [
          {
            label: 'Đặt lại',
            icon: 'delete',
            status: 'danger',
            action: () => {
              this.resetPermission();
            },
          },
          {
            label: 'Trở về',
            icon: 'back',
            status: 'info',
          },
        ],
      },
    });

    return false;
  }

  protected updatePermission(): void {

    const permissionsData = this.permissionFormArray.value;

    if (this.currentUserNode && this.currentUserNode.id && this.currentMenuNode && this.currentMenuNode.id) {

      let group = '';
      let user = '';
      const menuItem = this.currentMenuNode.id;

      // if (this.userGroups.findIndex((value: { id: string, name: string }, index) => {
      //   return value.id === this.userTreeState.focusedNodeId;
      // }) > -1) {
      //   group = this.userTreeState.focusedNodeId as string;
      // } else {
      //   user = this.userTreeState.focusedNodeId as string;
      // }

      if (this.currentUserNode.type === 'GROUP') {
        group = this.currentUserNode.id;
      }
      if (this.currentUserNode.type === 'USER') {
        user = this.currentUserNode.id;
      }

      permissionsData.forEach(element => {
        console.info(`Grant ${element.Code} (${element.Status}) on ${menuItem} to ${user || group}`);
      });

      if ((group || user) && menuItem && permissionsData) {
        this.apiService.post<{ Group: string, User: string, MenuItem: string, Permissions: PermissionEntryModel[] }>('/user/permissions', {
          Group: group,
          User: user,
          MenuItem: menuItem,
          Permissions: permissionsData,
        }, (result) => {
          this.allowUpdatePermission = false;
        });
      }
    }
  }

  protected resetPermission(): void {

    const permissionsData = this.permissionFormArray.value;

    if (this.currentUserNode && this.currentUserNode.id && this.currentMenuNode && this.currentMenuNode.id) {

      let group = '';
      let user = '';
      const menuItem = this.currentMenuNode.id;

      // if (this.userGroups.findIndex((value: { id: string, name: string }, index) => {
      //   return value.id === this.userTreeState.focusedNodeId;
      // }) > -1) {
      //   group = this.userTreeState.focusedNodeId as string;
      // } else {
      //   user = this.userTreeState.focusedNodeId as string;
      // }

      if (this.currentUserNode.type === 'GROUP') {
        group = this.currentUserNode.id;
      }
      if (this.currentUserNode.type === 'USER') {
        user = this.currentUserNode.id;
      }

      permissionsData.forEach(element => {
        console.info(`Grant ${element.Code} (${element.Status}) on ${menuItem} to ${user || group}`);
      });

      if ((group || user) && menuItem && permissionsData) {
        this.apiService.delete('/user/permissions', { Group: group, User: user, MenuItem: menuItem }, (result) => {
          this.allowUpdatePermission = false;
          this.loadPermission();
        });
      }
    }
  }

  onPermissionChange(event): false {
    this.allowUpdatePermission = true;
    return false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
