import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-tab-home',
  templateUrl: './tab-home.page.html',
  styleUrls: ['./tab-home.page.scss'],
})
export class TabHomePage implements OnInit {
  offset = 0;
  pokemon = [];
  @ViewChild(IonInfiniteScroll, {static: false}) infinite: IonInfiniteScroll;
  constructor(private pokeService: PokemonService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.loadPokemon();
  }
  loadPokemon(loadMore = false, event?){
    if(loadMore){
      this.offset+=25;
    }
    this.pokeService.getPokemon(this.offset).subscribe(res => {
      console.log('result: ', res);
      this.pokemon = [...this.pokemon, ...res];

      if(event){
        event.target.complete();
      }

      if(this.offset == 125){
        this.infinite.disabled = true;
      }
    })
  }

  onSearchChange(event){
    let value = event.detail.value;
    if(value == ''){
      this.pokemon = [];
      this.offset = 0;
      this.loadPokemon();
      return;
    }

    this.pokeService.findPokemon(value).subscribe(res => {
      this.pokemon = [res];
      
    }, err=>{
      this.pokemon = []
    });
  }

  logout(){
     this.authService.logout();
  }

}