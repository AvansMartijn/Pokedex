import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabHuntPage } from './tab-hunt.page';

const routes: Routes = [
  {
    path: '',
    component: TabHuntPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabHuntPageRoutingModule {}
