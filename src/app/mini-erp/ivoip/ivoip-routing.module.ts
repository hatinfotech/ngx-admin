import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CdrComponent } from './cdr/cdr.component';
import { IvoipComponent } from './ivoip.component';
import { PbxComponent } from './pbx/pbx.component';
import { DevicesComponent } from './devices/devices.component';
import { ExtensionsComponent } from './extensions/extensions.component';
import { PstnNumbersComponent } from './pstn-numbers/pstn-numbers.component';
import { CallBlocksComponent } from './call-blocks/call-blocks.component';


const routes: Routes = [{
  path: '',
  component: IvoipComponent,
  children: [
    {
      path: 'cdr',
      component: CdrComponent,
    },
    {
      path: 'pbx',
      component: PbxComponent,
    },
    {
      path: 'devices',
      component: DevicesComponent,
    },
    {
      path: 'extensions',
      component: ExtensionsComponent,
    },
    {
      path: 'pstn-numbers',
      component: PstnNumbersComponent,
    },
    {
      path: 'call-blocks',
      component: CallBlocksComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IvoipRoutingModule {
}
