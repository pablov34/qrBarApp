import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { BarService } from '../../providers/bar-service/bar-service';
import { AlertController } from 'ionic-angular';
import { InitPage } from '../init/init';
import { TermsAndConditionsPage } from '../termsandconditions/termsandconditions';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {
  sEmail: string;
  sNombre: string;
  sApellido: string;
  sTel: string;
  sPassword: string;
  sMessage: string;
  sErrorMessage: string;
  agreed: boolean = false;
  options = {
    headers: {
      'Content-Type': 'application/json',
      'Token':'',
      'UserId':''
    }
  };

  constructor(public navCtrl: NavController, private alertCtrl: AlertController,public barservice: BarService
    ,public storage: Storage, public app: App) {
  }

  //ionicViewDidLoad (se carga solo una vez cuando la vista se carga en memoria)
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
    this.getStoragedata();
  }

  getStoragedata()
  { 
    return Promise.all([this.storage.get("email"), this.storage.get("token"), this.storage.get('userid')]).
    then(values => {
      console.log("home Your email is", values[0]);
      console.log("home Your token is", values[1]);
      console.log("home Your userid is", values[2]);
      if(values[2] != undefined)
      {
     	 this.options.headers.Token = values[1];
        this.options.headers.UserId = values[2].toString();       
      } 
     
   })
 }

  userData = {
    "Email": "sample string 2",
    "Password": "sample string 3",
    "Name": "Nombre + Apellido",
    "Phone": "sample string 5",
    "Active": true,
    "Enable": true,
    "TermsAndConditions": true,
    "BarId": 1
  }

  registrar()
  {
    this.barservice.showLoading();
    console.log(this.agreed);
    this.userData.Email = this.sEmail;
    this.userData.Name = this.sNombre + " " + this.sApellido;
    this.userData.Phone = this.sTel;
    this.userData.Password = this.sPassword;
    this.userData.Active = true;
    this.userData.Enable = true;
    this.userData.TermsAndConditions = this.agreed;
    

    console.log(this.userData);
     if(this.sEmail != undefined && this.sPassword != undefined && this.sNombre != undefined && 
      this.sApellido != undefined &&  this.sTel != undefined)
      {
        if(this.agreed)
        {
          
          this.barservice.postRegistracion(this.userData, this.options).then
            (
              (res) => 
              {                
                console.log(res['Message']);
                let alert = this.alertCtrl.create({
                  title: "Registro",
                  subTitle: res['Message'],
                  buttons: [{
                    text:'Aceptar',
                    role: 'cancel',
                    handler: () => {
                      console.log('Aceptar clicked');
                      
                      this.navCtrl.push(InitPage);  
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
                  title: "Registro",
                  subTitle: error.error.Message,
                  buttons: [{
                    text:'Aceptar',
                    role: 'cancel', 
                    handler: () => {
                      
                      this.barservice.hideLoading();
                     
                    }       
                  }]
                });
                alert.present();
                
              }
            )
          }
          else
          {            
            let alert = this.alertCtrl.create({
              title: "Registro",
              subTitle: "Debe aceptar los terminos y condiciones",
              buttons: [{
                text:'Aceptar',
                role: 'cancel',  
                handler: () => {
                      
                  this.barservice.hideLoading();
                 
                }      
              }]
            });
            alert.present();
            
          }
      }
      else
      {
        
        let alert = this.alertCtrl.create({
          title: "Registro",
          subTitle: "Faltan datos",
          buttons: [{
            text:'Aceptar',
            role: 'cancel', 
            handler: () => {
                      
              this.barservice.hideLoading();
             
            }          
          }]
        });
        alert.present();
        
      }
      
  }

  goToInit(): void {
    //setear el root page a initpage para no tener mas TABS de navegacion
    this.storage.clear();
    this.navCtrl.setRoot(InitPage);
   }

   goToTermsAndConditions()
   {
    this.navCtrl.push(TermsAndConditionsPage);
   }
}
