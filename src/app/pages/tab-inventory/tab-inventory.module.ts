import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabInventoryPageRoutingModule } from './tab-inventory-routing.module';

import { TabInventoryPage } from './tab-inventory.page';
import { PopoverComponent } from 'src/app/components/popover/popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabInventoryPageRoutingModule
  ],
  declarations: [TabInventoryPage, PopoverComponent],
  entryComponents: [PopoverComponent]
})
export class TabInventoryPageModule {}
