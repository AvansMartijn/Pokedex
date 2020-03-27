import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  public baseUrl = 'https://pokeapi.co/api/v2';
  private imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
  private caughtPokemon = [];


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

  getPokeCount(){
    return this.http.get(this.baseUrl + "/pokemon");
  }

  getRandomPoke(fn, err){
    this.getPokeCount().subscribe(res => {
      let pokeCount = res['count'];
      let pokeIndex = Math.floor(Math.random() * pokeCount) + 1  
      this.http.get(`${this.baseUrl}/pokemon/${pokeIndex}`).subscribe(fn, err)
    }, err=>{
      console.log("FAILED, GET NEW ONE")
      // this.getRandomPoke(fn);
    });

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

  catchPoke(pokeIndex){
    this.findPokemon(pokeIndex).subscribe(res => {
      this.savePokemonInDb(res);
      // this.caughtPokemon.push(res);

    }, err=>{
      console.log(err);
    });
    // console.log(this.caughtPokemon);
  }

  // JSON "set" example
  async savePokemonInDb(pokemon) {
    const dateTime = Number(new Date());
    const key = pokemon.pokeIndex + "_" + dateTime.toString();
    await Storage.set({
      key: key,
      value: JSON.stringify(pokemon)
    }).catch(e => {
      console.log("Je inventory zit vol, laat wat pokemon vrij");
    });
    const newList = await this.getCaughtPokemonFromDB().then(data => {
      console.log(this.caughtPokemon);
      // this.freeAllPokemon();
    });
  }

  async getCaughtPokemonFromDB(){
    
    const keys = await Storage.keys().then(async (data) => {
      var newCaughtPokeList = [];
      for(let i = 0; i < data.keys.length; i++){
        // console.log(data.keys.length);
        const poke = await Storage.get({ key: data.keys[i] });
        // console.log(JSON.parse(poke.value));
        const pokeData = JSON.parse(poke.value);
        pokeData.lStorageKey = data.keys[i];
        newCaughtPokeList.push(pokeData);
      }
      this.caughtPokemon = newCaughtPokeList;
      // console.log()
      // this.freeAllPokemon();
      return this.caughtPokemon;
    });
    return this.caughtPokemon;

  }

  async freePoke(key){
    await Storage.remove({ key: key });
    return await this.getCaughtPokemonFromDB();
  }

  async freeAllPokemon() {
    await Storage.clear();
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
