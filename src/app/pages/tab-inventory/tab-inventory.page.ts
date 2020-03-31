import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PopoverComponent } from '../../components/popover/popover.component';
import { PopoverController, IonReorderGroup } from '@ionic/angular';


@Component({
  selector: 'app-tab-inventory',
  templateUrl: './tab-inventory.page.html',
  styleUrls: ['./tab-inventory.page.scss'],
})
export class TabInventoryPage implements OnInit {
  @ViewChild(IonReorderGroup, {static: false}) reorderGroup: IonReorderGroup;
  caughtPokemon = [];

  constructor(private pokeService: PokemonService, public popoverController: PopoverController) { }

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

  async openPopover(ev: Event, dbKey){
    const popOver = await this.popoverController.create({
      component: PopoverComponent,
      componentProps: {
        dbKey: dbKey
      },
      event: ev
    });

   

    return await popOver.present();

  }

  async doReorder(event){
    console.log(event);
    let itemToMove = this.caughtPokemon.splice(event.detail.from, 1)[0];
    this.caughtPokemon.splice(event.detail.to, 0, itemToMove);
    await this.pokeService.reorderCaughtPokemon(this.caughtPokemon);
    event.detail.complete();
  }

  toggleReorderGroup() {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }



}
