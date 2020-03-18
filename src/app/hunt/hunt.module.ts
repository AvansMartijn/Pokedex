import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HuntPageRoutingModule } from './hunt-routing.module';

import { HuntPage } from './hunt.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HuntPageRoutingModule
  ],
  declarations: [HuntPage],
  providers: [Geolocation]
})
export class HuntPageModule {}
