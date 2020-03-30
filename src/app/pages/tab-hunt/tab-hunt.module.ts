import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabHuntPageRoutingModule } from './tab-hunt-routing.module';

import { TabHuntPage } from './tab-hunt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabHuntPageRoutingModule
  ],
  declarations: [TabHuntPage]
})
export class TabHuntPageModule {}
