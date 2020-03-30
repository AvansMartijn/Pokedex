import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';


@Component({
  selector: 'app-tab-inventory',
  templateUrl: './tab-inventory.page.html',
  styleUrls: ['./tab-inventory.page.scss'],
})
export class TabInventoryPage implements OnInit {
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
