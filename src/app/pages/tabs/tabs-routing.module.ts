import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-home',
        loadChildren: () => import('../tab-home/tab-home.module').then( m => m.TabHomePageModule)
      },
      {
        path: 'tab-hunt',
        loadChildren: () => import('../tab-hunt/tab-hunt.module').then( m => m.TabHuntPageModule)
      },
      {
        path: 'tab-inventory',
        loadChildren: () => import('../tab-inventory/tab-inventory.module').then( m => m.TabInventoryPageModule)
      },
      {
        path: 'tab-home/:index',
        loadChildren: () => import('../detail/detail.module').then( m => m.DetailPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab-home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
