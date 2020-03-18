import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform, AlertController, NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-hunt',
  templateUrl: './hunt.page.html',
  styleUrls: ['./hunt.page.scss'],
})
export class HuntPage implements OnInit {
  // @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;
  userMarker: any;
  latitude = 51.6850;
  longitude = 5.8597;
  worldPokemon = [];

  positionSubscription: Subscription;

  constructor(public navCtrl: NavController, private plt: Platform, private geolocation: Geolocation, private alertCtrl: AlertController) { 
    // this.loadmap();
  }

  ngAfterViewInit() {
    this.initMap();
    this.setWatchPos();
  }

  initMap(){
    const POSITION = {lat: this.latitude, lng: this.longitude};
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: POSITION
    });
    const curPosition = new google.maps.LatLng(this.latitude, this.longitude);
    this.userMarker = new google.maps.Marker({
      position: curPosition,
      map: this.map
    });

    this.loadWorldPokemon();


  }

  ngOnInit() {
  }
 

  getCurPos(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude
      this.longitude = resp.coords.longitude
      // resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }
  
  setWatchPos(){
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.latitude = data.coords.latitude
      this.longitude = data.coords.longitude
      this.updateMap();
    });
  }

  updateMap(){
    const curPosition = new google.maps.LatLng(this.latitude, this.longitude);
    this.userMarker.setPosition(curPosition);
    this.map.setCenter(curPosition);
    console.log('update map');
  }

  loadWorldPokemon(){
    this.worldPokemon = [
      {name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", pokeIndex: 1, latitude: 51.689331, longitude: 5.861730},
      {name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png", pokeIndex: 2, latitude: 51.687124, longitude: 5.862223}
    ]

    for(var i = 0; i < this.worldPokemon.length; i++){
      // console.log(this.worldPokemon[i]);
      const pokePosition = new google.maps.LatLng(this.worldPokemon[i].latitude, this.worldPokemon[i].longitude);
      const marker = new google.maps.Marker({
        position: pokePosition,
        map: this.map,
        icon: this.worldPokemon[i].image
      });
    }
  }

}
