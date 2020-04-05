import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-home',
        canActivate: [AuthGuard],
        loadChildren: () => import('../tab-home/tab-home.module').then( m => m.TabHomePageModule)
      },
      {
        path: 'tab-hunt',
        canActivate: [AuthGuard],
        loadChildren: () => import('../tab-hunt/tab-hunt.module').then( m => m.TabHuntPageModule)
      },
      {
        path: 'tab-inventory',
        canActivate: [AuthGuard],
        loadChildren: () => import('../tab-inventory/tab-inventory.module').then( m => m.TabInventoryPageModule)
      },
      {
        path: 'tab-home/:index',
        canActivate: [AuthGuard],
        loadChildren: () => import('../detail/detail.module').then( m => m.DetailPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/tab-home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
