/// <reference types="@types/googlemaps" />
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {

  @Input() coords: {latitude: number, longitude: number};

  constructor() { }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap(){
    const POSITION = {lat: this.coords.latitude, lng: this.coords.longitude};
    const map = new google.maps.Map(document.getElementById('huntMap'), {
      zoom: 12,
      center: POSITION
    });
    const marker = new google.maps.Marker({
      position: POSITION,
      map: map
    });
  }


}
