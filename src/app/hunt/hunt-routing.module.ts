import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HuntPage } from './hunt.page';

const routes: Routes = [
  {
    path: '',
    component: HuntPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HuntPageRoutingModule {}
