import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { PokemonService } from 'src/app/services/pokemon.service';

import { Plugins } from '@capacitor/core';

const { Toast } = Plugins;

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  dbKey = null;
  newName: String = "";

  constructor(private navParams: NavParams, private popoverController: PopoverController, private pokeService: PokemonService) { }

  ngOnInit() {
    this.dbKey = this.navParams.get('dbKey');
  }

  closePopover(){
    this.popoverController.dismiss();
  }

  async saveNewPokeName(){
    console.log("savenewname");
    const saveSuccess = await this.pokeService.updatePokeName(this.dbKey, this.newName);
    if(saveSuccess){
      this.showToast("Name saved");
    }else{
      this.showToast("Pokemon didn't like new name, try again")
    }
  }

  async showToast(toastText) {
    await Toast.show({
      text: toastText
    });
  }

}
