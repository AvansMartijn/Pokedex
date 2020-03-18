import { Component, OnInit } from '@angular/core';
// import { GeolocationService } from '../services/geolocation.service';
import { Plugins } from '@capacitor/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

// const { Geolocation } = Plugins;

@Component({
  selector: 'app-hunt',
  templateUrl: './hunt.page.html',
  styleUrls: ['./hunt.page.scss'],
})
export class HuntPage implements OnInit {
  latitude = 45;
  longitude = 45;
  count = 0;
  getposcount = 0;
  watchposcount = 0;

  constructor(private geolocation: Geolocation) { }

  ngOnInit() {
    this.getCurPos();
    this.setWatchPosition();
  }

  getCurPos(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.setCoords(resp)
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }
  
  setWatchPosition() {
    let options = {
      enableHighAccuracy: true,
      timeout: 2000,
      maximumAge: 0,
    };
    this.geolocation.watchPosition(options)
      .subscribe((data) => {
        this.setCoords(data)
   
    });
  }

  setCoords(resp){
    this.latitude = resp.coords.latitude;
    this.longitude = resp.coords.longitude;
  }

}
