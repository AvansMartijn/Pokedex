import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabInventoryPage } from './tab-inventory.page';

const routes: Routes = [
  {
    path: '',
    component: TabInventoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabInventoryPageRoutingModule {}
