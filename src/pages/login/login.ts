import { Component } from '@angular/core';
import { NavController, DateTime } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { BarService } from '../../providers/bar-service/bar-service';
import { AlertController } from 'ionic-angular';
import { OlvidaContrasenaPage } from '../olvidacontrasena/olvidacontrasena';
import { FCM } from '@ionic-native/fcm';
import { InitPage } from '../init/init';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userDataFromAPI: any = [];
  sEmail: string;
  sPassword: string;
  sMessage: string;
  sErrorMessage: string;
  todayDate: Date = new Date();

  options = {
    headers: {
      'Content-Type': 'application/json',
      'Token':'',
      'UserId':'',
      'FcmToken':''
    }
  };

  constructor(public navCtrl: NavController, private storage: Storage, private barservice: BarService, 
    private alertCtrl: AlertController, public fcm: FCM) {
    
  }


  //ionicViewDidLoad (se carga solo una vez cuando la vista se carga en memoria)
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToTab(): void {
     // set a key/value
    this.navCtrl.push(TabsPage);
  }

  login(): void {
   // this.storage.clear();
    this.userDataFromAPI = [];
    console.log(this.sPassword);
    console.log(this.sEmail);
    this.sMessage = "";
    this.sErrorMessage = "";

    if(this.sEmail != undefined && this.sPassword != undefined)
    {
      this.barservice.showLoading();
       this.barservice.getLogin(this.sEmail, this.sPassword).then
        (
          (res) => 
          {      
            this.userDataFromAPI = JSON.parse(res['Data'].toString());
            console.log(this.userDataFromAPI);
            this.storage.set('email', this.sEmail);
            this.storage.set('token',this.userDataFromAPI.Token);
            this.storage.set('userid',this.userDataFromAPI.UserId);
            console.log('logindate ', this.todayDate);// this.storage.set('logindate', ) 
            this.todayDate.setDate(this.todayDate.getDate() + 1);
            console.log('logindate+1 ', this.todayDate);
            this.storage.set('loginenddate',this.todayDate);

            this.fcm.getToken().then(token => {
              
                this.storage.set('userFCMToken',token);
                //alert("saved userFCMToken TO storage: " +  token);
                this.options.headers.Token = this.userDataFromAPI.Token.toString();
                this.options.headers.UserId = this.userDataFromAPI.UserId.toString();
                this.options.headers.FcmToken = token.toString();
                //alert("Token " + this.options.headers.Token + " UserId " + this.options.headers.UserId)
                
                this.barservice.putfcmtoken(this.options).then
                (
                  (res) => 
                  {
                    //alert("userFCMToken SAVED TO API ");
                  },
                  (error) =>
                  {
                    let alert = this.alertCtrl.create({
                      title: "Ingreso",
                      subTitle: error.error.Message,
                      buttons: [{
                        text:'Aceptar',
                        role: 'cancel',           
                      }]
                    });
                    alert.present();
                  }
                )   
              
            })

           // this.sMessage = this.sMessage = res['Message']; 
            //this.barservice.setheaderoptions();
            this.barservice.hideLoading();
            this.navCtrl.push(TabsPage);
          },
          (error) =>
          {
            this.barservice.hideLoading();
            // console.error(error);
            // console.error(error.error.Message);
            this.sErrorMessage = error.error.Message;
            let alert = this.alertCtrl.create({
              title: "Ingreso",
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
        title: "Ingreso",
        subTitle: "Debe ingresar email y password",
        buttons: [{
          text:'Aceptar',
          role: 'cancel',           
        }]
      });
      alert.present();
    }
  }

  forgot()
  {
    this.navCtrl.push(OlvidaContrasenaPage);
  }

  goToInit(): void {
    //setear el root page a initpage para no tener mas TABS de navegacion
    this.storage.clear();
    this.navCtrl.setRoot(InitPage);
   }
}
