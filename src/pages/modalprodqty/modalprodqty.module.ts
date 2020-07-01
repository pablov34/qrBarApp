import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalprodqtyPage } from './modalprodqty';

@NgModule({
  declarations: [
    ModalprodqtyPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalprodqtyPage),
  ],
  exports: [
    ModalprodqtyPage
  ]
})
export class ModalprodqtyModule {}