import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartBotComponent } from './smart-bot.component';



@NgModule({
  declarations: [SmartBotComponent],
  imports: [
    CommonModule
  ],
  exports: [
    SmartBotComponent,
  ]
})
export class SmartBotModule { }
