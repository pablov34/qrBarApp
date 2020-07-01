import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { App } from 'ionic-angular';
import { BarService } from '../../providers/bar-service/bar-service';
import { InitPage } from '../init/init';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-micuenta',
    templateUrl: 'micuenta.html'
  })


  export class MiCuentaPage {
    UserDataFromAPI: any = [];
    sEmail: string;
    sPhone: string;
    sName: string;
    sApellido: string;
    sPassword: string;
    sCurrentPassword: string;
    sMessage: string;
    sErrorMessage: string;
    options = {
      headers: {
        'Content-Type': 'application/json',
        'Token':'',
        'UserId':''
      }
    };

    constructor(public navCtrl: NavController, public app: App, public barservice: BarService,
      private alertCtrl: AlertController,public storage: Storage) {

    }

    //ionicViewDidLoad (se carga solo una vez cuando la vista se carga en memoria)
    ionViewDidLoad(){
      this.getStoragedata();  
    }

    getStoragedata()
    { 
      return Promise.all([this.storage.get("email"), this.storage.get("token"), this.storage.get('userid')]).
      then(values => {
        console.log("nuevopedido Your email is", values[0]);
        console.log("nuevopedido Your token is", values[1]);
        console.log("nuevopedido Your userid is", values[2]);
        if(values[2] != undefined)
        {
          this.options.headers.Token = values[1];
          this.options.headers.UserId = values[2].toString();

          this.load();
        } 
       
     })
   }

   load()
   {
      this.barservice.showLoading();
      this.barservice.getUser(this.options).then
      (
        (res) => 
        { 
          this.UserDataFromAPI = JSON.parse(res['Data'].toString());
          console.log(this.UserDataFromAPI);
          this.sName = this.UserDataFromAPI.Name;
          this.sEmail = this.UserDataFromAPI.Email;
          this.sPhone = this.UserDataFromAPI.Phone;
          this.barservice.hideLoading();
        },
        (error) =>
        {
          let message;
          console.error(error);
 
           this.barservice.hideLoading();
           if(error.error != undefined)
           {
               if(error.error.Message == "Usuario/token inválido")
               {
                 message = "Se ha vencido la sesión, vuelva a ingresar para continuar";
                 this.storage.clear();
                 this.navCtrl.setRoot(InitPage);
               }
               else
               {
                 message = error.error.Message;
               }
           }
           else if(error.message != undefined && error.message == "Timeout has occurred")
           {
             message = "Tiene problemas con la  conexion. Verifiquela o intente mas tarde";
           }
           console.error(error.message);
           let alert = this.alertCtrl.create({
             title: 'qrBar',
             subTitle: message,
             buttons: [{
               text:'Aceptar',
               handler: () => {
                 console.log('Aceptar clicked');           
               }
             }]
           });
           alert.present();
        }
      )
   }

    goToInit(): void {
     //setear el root page a initpage para no tener mas TABS de navegacion
     if(this.sPassword != undefined && this.sCurrentPassword != undefined)
     {
       if(this.sPassword != "" && this.sCurrentPassword != "")
       {
         this.storage.clear();
         this.app.getRootNav().setRoot(InitPage);
       }      
     }                 
    }

    closesession()
    {
      this.storage.clear();
         this.app.getRootNav().setRoot(InitPage);
    }

    userData ={
      "CurrentPassword":"",
      "Password": "1234567",
      "Name": "Julian",
      "Phone": "222222"
    }

    guardar(): void{
      this.barservice.showLoading();

      this.userData.Name = this.sName;
      if(this.sPassword != undefined)
          this.userData.Password = this.sPassword;
      else
          this.userData.Password = "";

      if(this.sCurrentPassword != undefined)
          this.userData.CurrentPassword = this.sCurrentPassword;
     else
          this.userData.CurrentPassword = "";

      this.userData.Phone = this.sPhone;
      console.log(this.userData);
       this.sMessage = "";
      this.sErrorMessage = "";
     
        if(this.sName != "")
        {
          this.barservice.putUser(this.userData, this.options).then
          (
            (res) => 
            { 
              console.log(res);
              this.barservice.hideLoading();
                  let alert = this.alertCtrl.create({
                    title: 'Mi Cuenta',
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
                  this.sMessage = res['Message'];               
            },
            (error) =>
            {
              this.barservice.hideLoading();
              console.error(error.error.Message);
              let alert = this.alertCtrl.create({
                title: 'Mi Cuenta',
                subTitle: error.error.Message,
                buttons: [{
                  text:'Aceptar',
                  handler: () => {
                    console.log('Aceptar clicked');           
                  }
                }]
              });
              alert.present();
              this.sErrorMessage = error.error.Message; 
            }
          )  
      }
      else{
        this.sErrorMessage = "falta ingresar Nombre y Apellido";
      }
    }
  }