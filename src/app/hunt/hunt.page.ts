import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform, AlertController, NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PokemonService } from '../services/pokemon.service';

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
  latitude = 45.6850;
  longitude = 45.8597;
  worldPokemon = [];
  worldPokeCounter = 0;
  pokeMarkers = [];

  positionSubscription: Subscription;

  constructor(public navCtrl: NavController, private plt: Platform, private geolocation: Geolocation, private alertCtrl: AlertController, private pokeService: PokemonService) { 
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
      map: this.map,
      zIndex: 100
    });

    this.loadWorldPokemon();


  }

  ngOnInit() {
  }
 

  getCurPos(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude
      this.longitude = resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }
  
  setWatchPos(){
    let watchOpts = {
      enableHighAccuracy: true,
      timeout: 1000
    }
    let watch = this.geolocation.watchPosition(watchOpts);
    watch.subscribe((data) => {
      this.latitude = data.coords.latitude
      this.longitude = data.coords.longitude
      this.checkPokemonDistance()
      if(this.worldPokeCounter < 10){
        this.getRandomPokeFromService();
      }
      this.updateMap();

    });
  }

  updateMap(){
    const curPosition = new google.maps.LatLng(this.latitude, this.longitude);
    this.userMarker.setPosition(curPosition);
    this.map.setCenter(curPosition);
  }

  loadWorldPokemon(){
    for(var i = 0; i < 10; i++){
      this.getRandomPokeFromService();
    }

  }

  checkPokemonDistance(){
    
    for(let i = 0; i < this.worldPokemon.length; i++){
      if(this.worldPokemon[i]){
        let userLat = this.latitude;
        let userLon = this.longitude;
        let pokeLat = this.worldPokemon[i].latitude;
        let pokelon = this.worldPokemon[i].longitude;
        let distance = this.pokeService.getDistanceFromLatLonInMeter(userLat, userLon, pokeLat, pokelon);
        if(distance > 20000){
          delete this.worldPokemon[i]
          this.worldPokeCounter -= 1;
          this.pokeMarkers[i].setMap(null);
        }
      }
    }    
  }

  getRandomPokeFromService(){
    this.pokeService.getRandomPoke((res) => {

      this.getCurPos();

      let maxLat = this.latitude + 0.01
      let minLat = this.latitude - 0.01
      let maxLon = this.longitude + 0.01
      let minLon = this.longitude - 0.01
  
      let pokeLat = (Math.random() * (maxLat - minLat) + minLat).toFixed(5);
      let pokeLon = (Math.random() * (maxLon - minLon) + minLon).toFixed(5);

      let pokeImage = this.pokeService.getPokemonImage(res['id']);
      let pokeUrl = `${this.pokeService.baseUrl}/pokemon/${res['id']}`
      
      let newWorldPoke = {name: res['name'], url: pokeUrl, image: pokeImage, pokeIndex: res['id'], latitude: pokeLat, longitude: pokeLon}

      //todo: check for free spots in array
      let i = null;
      for(var x = 0; x < this.worldPokemon.length; x++){
        // if there is a empty spot in array, fill that one
          if(!this.worldPokemon[x]){
            i = x;
            this.worldPokemon[i] = newWorldPoke;
            break;
          }
      }
      //if pokemon has not been put in array yet, push to end
      if(i == null){
        this.worldPokemon.push(newWorldPoke);
        i = this.worldPokemon.length -1;  
      }


      const pokePosition = new google.maps.LatLng(this.worldPokemon[i].latitude, this.worldPokemon[i].longitude);
      const marker = new google.maps.Marker({
        position: pokePosition,
        map: this.map,
        icon: this.worldPokemon[i].image
      });
      this.pokeMarkers[i] = marker;
      marker.set('pokeIndex', this.worldPokemon[i].pokeIndex);
      marker.set('pokeArrId', i);
      this.worldPokeCounter += 1;
      marker.addListener('click', (event)=> {
        // console.log(event);
        const userPos = {latitude: this.latitude, longitude: this.longitude};
        const pokeArrId = marker.get('pokeArrId');
        const pokePos = {latitude: this.worldPokemon[pokeArrId].latitude, longitude: this.worldPokemon[pokeArrId].longitude};
        const isClose = this.pokeService.isCloseEnough(pokePos, userPos);
        this.pokeService.catchPoke(marker.get('pokeIndex'));
        delete this.worldPokemon[i];
        marker.setMap(null);
        this.worldPokeCounter -= 1;
      });

    }, (err) =>{
      this.getRandomPokeFromService();
    })
  }





}
