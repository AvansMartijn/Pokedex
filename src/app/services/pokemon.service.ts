import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/';
  private imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';


  constructor(private http: HttpClient) { 

  }

  getPokemon(offset = 0){
    return this.http.get(this.baseUrl + 'pokemon?offset=' + offset +'&limit=25').pipe(
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
    return `${this.imageUrl}${index}.png`;
  }

}
