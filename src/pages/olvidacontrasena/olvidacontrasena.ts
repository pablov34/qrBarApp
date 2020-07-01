import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BarService } from '../../providers/bar-service/bar-service';
import { AlertController } from 'ionic-angular';
import { InitPage } from '../init/init';
import { App } from 'ionic-angular';

@Component({
  selector: 'page-olvidacontrasena',
  templateUrl: 'olvidacontrasena.html',
})

export class OlvidaContrasenaPage {
  sEmail: string;
  sMessage: string;
  sErrorMessage: string;
  options = {
    headers: {
      'Content-Type': 'application/json',
      'Username':'',
      'BarId':'1'
    }
  };

  constructor(public navCtrl: NavController, private storage: Storage, private barservice: BarService, 
    private alertCtrl: AlertController,  public app: App) {   
  }

  //ionicViewDidLoad (se carga solo una vez cuando la vista se carga en memoria)
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToInit(): void {
    //setear el root page a initpage para no tener mas TABS de navegacion
    this.storage.clear();
    this.navCtrl.setRoot(InitPage);
   }

  enviar(): void {
   // this.storage.clear();
    console.log(this.sEmail);
    this.sMessage = "";
    this.sErrorMessage = "";

    if(this.sEmail != undefined && this.sEmail != "")
    {
      this.options.headers.Username = this.sEmail;
	    this.options.headers.BarId = this.barservice.BARID.toString();
      
      console.log(this.options);
        this.barservice.getContraseña(this.options).then
        (
          (res) => 
          {      
            let alert = this.alertCtrl.create({
              title: "Olvide Contraseña",
              subTitle: res['Message'],
              buttons: [{
                text:'Aceptar',
                handler: () => {
                  console.log('Aceptar clicked');
                  this.goToInit();
                }
              }]
            });
            alert.present();           
          },
          (error) =>
          {
            console.error(error.error.Message);
            this.sErrorMessage = error.error.Message;
            let alert = this.alertCtrl.create({
              title: "Olvide Contraseña",
              subTitle: error.error.Message,
              buttons: [{
                text:'Aceptar',
                role: 'cancel',           
              }]
            });
            alert.present();
          }
        )
    }
    else
    {
      let alert = this.alertCtrl.create({
        title: "Olvide Contraseña",
        subTitle: "Debe ingresar un email",
        buttons: [{
          text:'Aceptar',
          role: 'cancel',           
        }]
      });
      alert.present();
    }
  }

}
