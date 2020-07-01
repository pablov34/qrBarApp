import { Component, ViewChild  } from '@angular/core';
import { Platform, NavController  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { InitPage } from '../pages/init/init';
import { Storage } from '@ionic/storage';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import { Keyboard } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any = TabsPage;
  @ViewChild('myNav') navCtrl: NavController;
  rootPage:any = InitPage;
  userFCMToken: string;

  constructor(platform: Platform, statusBar: StatusBar, private splashScreen: SplashScreen, 
    private storage: Storage, private screenOrientation: ScreenOrientation, private keyboard: Keyboard) {
    platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.hideSplashScreen();
        statusBar.styleDefault();

        // set to portrait
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

       /* this.keyboard.willShow.subscribe(() => {
          document.body.classList.add('keyboard-is-open');
          alert("keyboard show");
         });*/

        /* window.addEventListener('keyboardDidShow', (event) => {
          // Describe your logic which will be run each time when keyboard is about to be shown.
          document.body.classList.add('hideElementOnKeyboardShown');
         // alert("keyboard show");
          });*/

         /* window.addEventListener('keyboardWillHide', (event) => {
            // Describe your logic which will be run each time when keyboard is about to be shown.
            document.body.classList.remove('hideElementOnKeyboardShown');
            //alert("keyboard hide");
          });*/

        /* this.keyboard.willHide.subscribe(() => {
          document.body.classList.remove('keyboard-is-open');
          alert("keyboard hide");
         });*/
        
    });
  }

  //mantener la splahs screen hasta que se termine la carga de la app y asi evitar pantalla en blanco
  hideSplashScreen() {
    console.log('Hola'+ this.splashScreen)
    if (this.splashScreen) {
    setTimeout(() => {
      this.splashScreen.hide();
    }, 100);
    }
    }
}
