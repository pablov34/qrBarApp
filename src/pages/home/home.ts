import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { BarService } from '../../providers/bar-service/bar-service';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { InitPage } from '../init/init';
import { App } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild(Slides) slides: Slides;
  //slideData = [{ image: "/assets/imgs/bar1.jpg" },{ image: "/assets/imgs/bar2.jpg" },{ image: "/assets/imgs/bar3.jpg" }]
  slideDataFromAPI: any = [];
  options = {
    headers: {
      'Content-Type': 'application/json',
      'Token':'',
      'UserId':''
    }
  };
  sindatos:boolean = false;

  constructor(public navCtrl: NavController, public barservice: BarService, public storage: Storage,
    private alertCtrl: AlertController,public app: App, public dataservice: DataServiceProvider) {
    
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
  }
  ionSlideAutoplayStop()
  {
    //alert("stop")
    this.slides.startAutoplay();
  }
  

 //ionicViewDidLoad (se carga solo una vez cuando la vista se carga en memoria)
  ionViewDidLoad(){   
    
    this.getStorageData(); 
   }
  
   ionViewWillEnter() //cada vez que entra a la pagina
   {
    //this.slides.autoplayDisableOnInteraction = false; //si toca el slider, no se detendrá el movimiento
    this.getStorageData(); 
   }

  getStorageData()
  {
    return Promise.all([this.storage.get("email"), this.storage.get("token"), this.storage.get('userid')]).
    then(values => {
      console.log("pedidos Your email is", values[0]);
      console.log("pedidos Your token is", values[1]);
      console.log("pedidos Your userid is", values[2]);
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
     let message;
     this.slideDataFromAPI= [];//reset
    
        this.barservice.getImages(this.options).then
        (
          (res) => 
          { 
            this.slideDataFromAPI = JSON.parse(res['Data'].toString());
            if(this.slideDataFromAPI.length > 0)
            {   
             console.log(this.slideDataFromAPI);
             //this.slides.update(); //reset
            }
            else
            {
              this.sindatos = true;
            }
            this.barservice.hideLoading();
          },
          (error) =>
          {
            this.barservice.hideLoading();
            if(error.error != undefined)
            {
              if(error.error.Message == "Usuario/token inválido")
              {
                message = "Se ha vencido la sesión, vuelva a ingresar para continuar";
                this.storage.clear();
                this.app.getRootNav().setRoot(InitPage);
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

  

}
