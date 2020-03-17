import { Component, OnInit } from '@angular/core';
import { Capacitor, Plugins, GeolocationPosition} from '@capacitor/core';
import { Observable, of, from as fromPromise } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

import { LoadingController, AlertController } from '@ionic/angular';

const { Toast, Geolocation } = Capacitor.Plugins;

@Component({
  selector: 'app-hunt',
  templateUrl: './hunt.page.html',
  styleUrls: ['./hunt.page.scss'],
})
export class HuntPage implements OnInit {
  public coordinates$: Observable<GeolocationPosition>;
  public defaultPos: { latitude: 45, longitude: 9 };

  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController) { }

  ngOnInit() {
    // start loader
    this.displayLoader()
      .then((loader: any) => {
        //get position
        return this.getCurrentPosition()
          .then(position => {
            //close loader and return position
            loader.dismiss();
            return position;
          })
          //if error
          .catch(err => {
            //close loader and return null
            loader.dismiss();
            return null;
            // console.log(err)
          })

      })
  }

  async displayLoader(){
    const loading = await this.loadingCtrl.create({
      message: "drawing map..."
    });
    await loading.present();
    return loading;
  }

  private async presentAlert(message: string): Promise<HTMLIonAlertElement>{
    const alert = await this.alertCtrl.create({
      header: 'Alert!',
      subHeader: 'I dropped my marbles into the internet device, we are offline.',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
    return alert;
  }

  private async getCurrentPosition(): Promise<any>{
    const isAvailable: boolean = Capacitor.isPluginAvailable('Geolocation');
    if(!isAvailable){
      console.log('Err: plugin is not available');
      return of(new Error('Err: plugin is not available'))
    }
    const POSITION = Plugins.Geolocation.getCurrentPosition()
    //handle capacitor errors
    .catch(err => {
      console.log(err);
      return new Error(err.message || 'getCurrentPosition catched an error from capacitor')
    })
    this.coordinates$ = fromPromise(POSITION).pipe(
      switchMap((data:any) => of(data.coords)),
      tap(data => console.log(data))
    );
    return POSITION;
  }

}
