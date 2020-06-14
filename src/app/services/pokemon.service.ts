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
      // let pokeCount = res['count'];
      let pokeCount = 150;
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
    const maxDistance = 300;
    // pokePos.lat

    // compare distance
    const distance = this.getDistanceFromLatLonInMeter(pokePos.latitude, pokePos.longitude, userPos.latitude, userPos.longitude)
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
  // async savePokemonInDbBU(pokemon) {
  //   const dateTime = Number(new Date());
  //   const key = pokemon.pokeIndex + "_" + dateTime.toString();
  //   await Storage.set({
  //     key: key,
  //     value: JSON.stringify(pokemon)
  //   }).catch(e => {
  //     console.log("Je inventory zit vol, laat wat pokemon vrij");
  //   });
  //   const newList = await this.getCaughtPokemonFromDB().then(data => {
  //     // console.log(this.caughtPokemon);
  //     // this.freeAllPokemon();
  //   });
  // }

    // JSON "set" example
  async savePokemonInDb(pokemon) {
    // const dateTime = Number(new Date());
    const newPokeKey = this.caughtPokemon.length;
    pokemon.lStorageKey = newPokeKey;
    this.caughtPokemon.push(pokemon);

    await this.savePokemonListInDb();
    // const newList = await this.getCaughtPokemonFromDB().then(data => {
    //   // console.log(this.caughtPokemon);
    //   // this.freeAllPokemon();
    // });
  }



  // async getCaughtPokemonFromDBBU(){
  //   const keys = await Storage.keys().then(async (data) => {
  //     var newCaughtPokeList = [];
  //     for(let i = 0; i < data.keys.length; i++){
  //       // console.log(data.keys.length);
  //       const poke = await Storage.get({ key: data.keys[i] });
  //       // console.log(JSON.parse(poke.value));
  //       const pokeData = JSON.parse(poke.value);
  //       pokeData.lStorageKey = data.keys[i];
  //       newCaughtPokeList.push(pokeData);
  //     }
  //     this.caughtPokemon = newCaughtPokeList;
  //     // console.log()
  //     // this.freeAllPokemon();
  //     return this.caughtPokemon;
  //   });
  //   return this.caughtPokemon;

  // }

  async getCaughtPokemonFromDB(){
    await Storage.get({key: "pokeList"}).then(async (data) => {
      var newCaughtPokeList = [];
      console.log(data);
      if(data.value != null){

        var pokeDbList = JSON.parse(data.value);
        for(let i = 0; i < pokeDbList.pokelist.length; i++){
          // console.log(data.keys.length);
          const pokeRecord = pokeDbList.pokelist[i];
          // console.log(JSON.parse(poke.value));
          newCaughtPokeList.push(pokeRecord);
        }
        this.caughtPokemon = newCaughtPokeList;
        // console.log()
        // this.freeAllPokemon();
        return this.caughtPokemon;
      }
    });
    return this.caughtPokemon;

  }

  async updatePokeName(key, newName){
    await Storage.get({key: "pokeList"}).then(async (result) => {
      const objResult = JSON.parse(result.value);
      const pokeList = objResult.pokelist
      var newCaughtPokemonList = []
      for(let i = 0; i < pokeList.length; i++){
        if(pokeList[i].lStorageKey == key){
          pokeList[i].name = newName;
        }
        newCaughtPokemonList.push(pokeList[i]);
      }
      this.caughtPokemon = newCaughtPokemonList;
      await this.savePokemonListInDb();
      
    });
    return true;
  }

  async reorderCaughtPokemon(newList){
    this.caughtPokemon = newList;
    await this.savePokemonListInDb();
  }

  async freePoke(key){
    await Storage.get({key: "pokeList"}).then(async (result) => {
      const objResult = JSON.parse(result.value);
      const pokeList = objResult.pokelist
      var newCaughtPokemonList = []
      for(let i = 0; i < pokeList.length; i++){
        let oldKey = pokeList[i].lStorageKey;
        pokeList[i].lStorageKey = i;
        if(key != oldKey){
          newCaughtPokemonList.push(pokeList[i]);
        }
      }
      this.caughtPokemon = newCaughtPokemonList;
      await this.savePokemonListInDb();
      
    });
    return this.caughtPokemon;
  }

  async savePokemonListInDb(){
    let data = {pokelist: this.caughtPokemon};
    const key = "pokeList";
    await Storage.set({
      key: key,
      value: JSON.stringify(data)
    }).catch(e => {
      console.log("Je inventory zit vol, laat wat pokemon vrij");
    });
  }

  async freeAllPokemon() {
    await Storage.remove({ key: "pokeList"})
    
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
