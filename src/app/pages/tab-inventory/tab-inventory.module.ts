import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabInventoryPageRoutingModule } from './tab-inventory-routing.module';

import { TabInventoryPage } from './tab-inventory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabInventoryPageRoutingModule
  ],
  declarations: [TabInventoryPage]
})
export class TabInventoryPageModule {}
