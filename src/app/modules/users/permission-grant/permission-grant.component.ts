import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserGroupModel } from '../../../models/user-group.model';
import { MenuItemModel } from '../../../models/menu-item.model';
import { TreeComponent, ITreeState } from 'angular-tree-component';
import { PermissionEntryModel } from '../../../models/permission-entry.model';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ShowcaseDialogComponent } from '../../dialog/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';
import localeEn from '@angular/common/locales/en';

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
  permissionData: any = {
    menuItem: {},
    resources: {},
  };

  /** Destroy monitoring */
  destroy$: Subject<null> = new Subject<null>();

  allowUpdatePermission = false;

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
  ) {

    // this.permissionForm = this.formBuilder.group({
    //   menuItem: this.formBuilder.group({
    //     array: this.formBuilder.array([]),
    //   }),
    //   resources: this.formBuilder.array([]),
    // });
    this.permissionForm = new FormGroup({
      menuItem: this.formBuilder.array([]),
      resources: this.formBuilder.group({}),
    });
    // this.permissionForm.addControl('menuItem', this.formBuilder.group({}));
    // (this.permissionForm.get('menuItem') as FormGroup).addControl('VIEW', this.formBuilder.control(false));
    // (this.permissionForm.get('menuItem') as FormGroup).addControl('CREATE', this.formBuilder.control(false));
    // (this.permissionForm.get('menuItem') as FormGroup).addControl('UPDATE', this.formBuilder.control(false));
    // (this.permissionForm.get('menuItem') as FormGroup).addControl('DELETE', this.formBuilder.control(false));
    // this.permissionForm.addControl('resources', this.formBuilder.group({}));

    // (this.permissionForm.get('resources') as FormGroup).addControl('Ivoip_Resource_Pstns', this.formBuilder.group({}));
    // (this.permissionForm.get('resources.Ivoip_Resource_Pstns') as FormGroup).addControl('VIEW', this.formBuilder.control(false));
    // (this.permissionForm.get('resources.Ivoip_Resource_Pstns') as FormGroup).addControl('CREATE', this.formBuilder.control(false));
    // (this.permissionForm.get('resources.Ivoip_Resource_Pstns') as FormGroup).addControl('UPDATE', this.formBuilder.control(false));
    // (this.permissionForm.get('resources.Ivoip_Resource_Pstns') as FormGroup).addControl('DELETE', this.formBuilder.control(false));

    // (this.permissionForm.get('resources') as FormGroup).addControl('Ivoip_Resource_Domains', this.formBuilder.group({}));
    // (this.permissionForm.get('resources.Ivoip_Resource_Domains') as FormGroup).addControl('VIEW', this.formBuilder.control(false));
    // (this.permissionForm.get('resources.Ivoip_Resource_Domains') as FormGroup).addControl('CREATE', this.formBuilder.control(false));
    // (this.permissionForm.get('resources.Ivoip_Resource_Domains') as FormGroup).addControl('UPDATE', this.formBuilder.control(false));
    // (this.permissionForm.get('resources.Ivoip_Resource_Domains') as FormGroup).addControl('DELETE', this.formBuilder.control(false));

    // (this.permissionForm.get('resources') as FormGroup).addControl('Ivoip_Resource_Pbxs', this.formBuilder.group({}));
    // (this.permissionForm.get('resources.Ivoip_Resource_Pbxs') as FormGroup).addControl('VIEW', this.formBuilder.control(false));
    // (this.permissionForm.get('resources.Ivoip_Resource_Pbxs') as FormGroup).addControl('CREATE', this.formBuilder.control(false));
    // (this.permissionForm.get('resources.Ivoip_Resource_Pbxs') as FormGroup).addControl('UPDATE', this.formBuilder.control(false));
    // (this.permissionForm.get('resources.Ivoip_Resource_Pbxs') as FormGroup).addControl('DELETE', this.formBuilder.control(false));

    this.apiService.get<UserGroupModel[]>('/user/groups', { limit: 999999, includeUsers: true, selectUsers: 'id=>Code,name=>Name,type=>Type', isTree: true, select: 'id=>Code,name=>Name,description=>Description,children=>Children,type=>Type' },
      list => {
        this.userGroups = this.prepareUserGroupTree(list);
      });

    this.apiService.get<MenuItemModel[]>('/menu/menu-items', { limit: 999999, isTree: true, includeUsers: true, select: 'id=>Code,name=>Title,children=>Children' }, list => {
      this.menuTree = list;
    });

  }

  prepareUserGroupTree(tree: UserGroupModel[]) {
    for (let i = 0; i < tree.length; i++) {
      tree[i]['name'] = tree[i]['name'] + ': ' + tree[i]['description'];
      if (tree[i]['children']) {
        this.prepareUserGroupTree(tree[i]['children']);
      }
    }
    return tree;
  }

  ngOnInit() {
  }

  getObjectKeys(obj: any) {
    return Object.keys(obj);
  }

  getAsFormArray(form: AbstractControl) {
    return form as FormArray;
  }

  getAsFormGroup(form: AbstractControl) {
    return form as FormGroup;
  }

  patchPermissionFormData(data: any) {
    this.permissionForm = new FormGroup({});
    this.permissionForm.addControl('menuItem', this.formBuilder.array([]));
    this.permissionForm.addControl('resources', this.formBuilder.group({}));

    const menuItemPmsFormArray = (this.permissionForm.get('menuItem') as FormArray);
    const resourcesPmsFormGroup = (this.permissionForm.get('resources') as FormGroup);

    data['menuItem'].forEach(pms => {
      menuItemPmsFormArray.push(this.formBuilder.group({
        Permission: [pms['Permission']],
        Description: [pms['Description']],
        Status: [pms['Status']],
      }));
    });

    Object.keys(data['resources']).forEach(resourceName => {
      const resourcePms = data['resources'][resourceName];
      const pmsFormArray = this.formBuilder.array([]);

      resourcePms['Permissions'].forEach(pms => {
        pmsFormArray.push(this.formBuilder.group({
          Permission: [pms['Permission']],
          Description: [pms['Description']],
          Status: [pms['Status']],
        }));
      });

      resourcesPmsFormGroup.addControl(resourceName, pmsFormArray);
    });
  }

  get allowResetPermission() {
    return this.currentUserNode && this.currentUserNode.id && this.currentMenuNode && this.currentMenuNode.id;
  }

  get permissionFormArray(): FormArray {
    return this.permissionForm.get('menuItem.array') as FormArray;
  }

  get resourcesPermissionFormArray(): FormArray {
    return this.permissionForm.get('resources') as FormArray;
  }

  getResourcePermissionFormArray(resource: number): FormArray {
    return this.permissionForm.get('resources[' + resource + ']') as FormArray;
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

      this.apiService.get<{ [key: string]: any }>('/user/permissions', {
        group: group,
        user: user,
        menuItem: menuItem,
      }, (result) => {
        console.info(result);
        this.permissionData = result;
        this.patchPermissionFormData(result);
        // this.permissionFormArray.clear();
        // const menuItemPermission = (result.menuItem as []);
        // const resourcesPermission = (result.resources as { [key: string]: [] });
        // menuItemPermission.forEach(element => {
        //   const newPermissionFormItem = this.formBuilder.group({
        //     Permission: '',
        //     Description: '',
        //     Status: '',
        //   });

        //   newPermissionFormItem.patchValue(element);
        //   this.permissionFormArray.push(newPermissionFormItem);
        // });

        // Object.keys(resourcesPermission).forEach(resourceName => {
        //   const resource = resourcesPermission[resourceName];
        //   const formGroup = {};
        //   const formArray = formGroup[resourceName] = this.formBuilder.array([]);
        //   resource.forEach(pms => {
        //     const newResourcePermissionFormItem = this.formBuilder.group({
        //       Permission: '',
        //       Description: '',
        //       Status: '',
        //     });
        //     newResourcePermissionFormItem.patchValue(pms);
        //     formArray.push(newResourcePermissionFormItem);
        //   });
        //   const resourceForm = this.formBuilder.group(formGroup);
        //   this.resourcesPermissionFormArray.clear();
        //   this.resourcesPermissionFormArray.push(resourceForm);
        // });

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

    const permissionsData = this.permissionForm.value;

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

      // permissionsData.forEach(element => {
      //   console.info(`Grant ${element.Code} (${element.Status}) on ${menuItem} to ${user || group}`);
      // });

      if ((group || user) && menuItem && permissionsData) {
        this.apiService.post<{ group: string, menuItem: string, permissions: PermissionEntryModel[] }>('/user/permissions', {}, {
          group: group,
          // user: user,
          menuItem: menuItem,
          permissions: permissionsData,
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
