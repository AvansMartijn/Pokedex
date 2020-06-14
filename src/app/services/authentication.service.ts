import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;


const TOKEN_KEY = 'auth-token';
 
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 
  authenticationState = new BehaviorSubject(false);
 
  constructor(private plt: Platform) { 
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }
 
  async checkToken() {
    await Storage.get({key: TOKEN_KEY}).then(res => {
      if (res.value != null) {
        console.log(res);
        this.authenticationState.next(true);
      }
    })
  }
 
  async login(userName, password) {
    await Storage.get({key: userName}).then(async res => {
      if(res.value == password){
        return await Storage.set({key: TOKEN_KEY, value: userName}).then(() => {
          this.authenticationState.next(true);
        });
      }else{
        console.log("Wrong Credentials");
      }
    })
    
  }

  async register(userName, password){
    return await Storage.set({key: userName, value: password}).then(() =>{
      this.login(userName, password);
    })
  }
 
  async logout() {
    return await Storage.remove({key: TOKEN_KEY}).then(() => {
      this.authenticationState.next(false);
    });
  }
 
  isAuthenticated() {
    return this.authenticationState.value;
  }
 
}