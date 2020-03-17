import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HuntPageRoutingModule } from './hunt-routing.module';

import { HuntPage } from './hunt.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HuntPageRoutingModule,
    SharedModule
  ],
  declarations: [HuntPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HuntPageModule {}
