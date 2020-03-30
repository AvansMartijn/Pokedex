import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  caughtPokemon = [];

  constructor(private pokeService: PokemonService) { }

  ngOnInit() {
    this.updateCaughtPokemon();
  }

  async updateCaughtPokemon(){
    const newList = await this.pokeService.getCaughtPokemonFromDB();
    // console.log(newList);
    this.caughtPokemon = newList;
  }

  async freePoke(key){
    const newList = await this.pokeService.freePoke(key);
    this.caughtPokemon = newList;

  }

}
