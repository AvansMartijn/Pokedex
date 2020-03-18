import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';
  private imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';


  constructor(private http: HttpClient) { 

  }

  getPokemon(offset = 0){
    return this.http.get(this.baseUrl + '/pokemon?offset=' + offset +'&limit=25').pipe(
      map(result =>{
        console.log(offset)
        return result['results'];
      }),
      map(pokemons =>{
        return pokemons.map((poke, index) => {
          poke.image = this.getPokemonImage(index + offset + 1);
          poke.pokeIndex = offset + index + 1;
          return poke;
        })
      })
    )
  }

  getPokemonImage(index){
    return `${this.imageUrl}/${index}.png`;
  }

  findPokemon(search){
    return this.http.get(`${this.baseUrl}/pokemon/${search}`).pipe(
      map(pokemon => {
        pokemon['image'] = this.getPokemonImage(pokemon['id']);
        pokemon['pokeIndex'] = pokemon['id'];
        return pokemon;
      })
    );
  }

  getPokeDetails(index){
    return this.http.get(`${this.baseUrl}/pokemon/${index}`).pipe(
      map(poke => {
        let sprites = Object.keys(poke['sprites']);
        poke['images'] = sprites
          .map(spriteKey => poke['sprites'][spriteKey])
          .filter(img => img);
        return poke;
      })
    );
  }

  isCloseEnough(pokePos, userPos){
    const maxDistance = 4000;
    // pokePos.lat
    console.log('pokePos: lat:' + pokePos.latitude + 'lon:' + pokePos.longitude);
    console.log('userPos: lat:' + userPos.latitude + 'lon:' + userPos.longitude);
    // compare distance
    const distance = this.getDistanceFromLatLonInMeter(pokePos.latitude, pokePos.longitude, userPos.latitude, userPos.longitude)
    console.log('distance: ' + distance);
    return (distance<maxDistance);
  }

  getDistanceFromLatLonInMeter(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d*1000;
}

deg2rad(deg) {
    return deg * (Math.PI / 180)
}

}
