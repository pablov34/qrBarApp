import { Component } from '@angular/core';
import { NavController, DateTime, NavParams  } from 'ionic-angular';
import { BarService } from '../../providers/bar-service/bar-service';
import { resolveDefinition } from '@angular/core/src/view/util';
import {ReservasPage } from '../reservas/reservas';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-nuevareserva',
  templateUrl: 'nuevareserva.html'
})
export class NuevaReservaPage {
  gridDataFromAPI: any = [];
  sNombre: string;
  //sEmail: string;
  sTel: string;
  sCantPersonas: number = 0;
  sTitle: string;
  sTitle2:string;
  myReserveDate: string;
  sMessage: string;
  sErrorMessage: string;
  itemid: number;
  isDisabled: boolean;
  sEmailFromStorage: string;
  userId: number;
  permiteeditar: boolean;
  statusname:string;
  todayDate: Date = new Date();
  simpleColumns: any;

  options = {
    headers: {
      'Content-Type': 'application/json',
      'Token':'',
      'UserId':''
    }
  };

  //NavParamas para recibir los datos desde pagina reserva, edicion
  constructor(public navCtrl: NavController, public barservice: BarService, public navParams: NavParams,
    private selector: WheelSelector, private alertCtrl: AlertController, private storage: Storage,
    public events: Events) {
     console.log(NavParams);
     this.sCantPersonas = 2; // Por defecto
     if(navParams != null)
     {
        this.itemid = navParams.get('id');

        if(this.itemid != null)
        {
          this.sTitle = "Editar"; //navParams.get('title');
          this.sTitle2 = "Reserva";
          this.sNombre = navParams.get('name');
          //this.sEmail = navParams.get('email');
          this.sCantPersonas = navParams.get('persons');         
          this.myReserveDate = navParams.get('reservadate');
          console.log("reserve date: " + this.myReserveDate);
          this.sTel = navParams.get('phone');
          console.log("this item: " + this.itemid);
          this.isDisabled = true
          this.permiteeditar = navParams.get('permiteeditar');  
          console.log("permite editar: " + this.permiteeditar);
          this.statusname = navParams.get('status');  
          console.log("statusname: " + this.statusname);

          if(this.statusname == "Finalizada")
          {
            this.myReserveDate = this.todayDate.toISOString();
            console.log(this.myReserveDate);
          }
        }
        else
        {
          console.log("NUEVA RESERVA itemid is null");
          this.isDisabled = true;
          this.sTitle = "Nueva";
          this.sTitle2 = "Reserva";
          this.sCantPersonas = 1;
        }
      }

      this.simpleColumns = [
        {
          name: 'persons',
          options: [
            { text: '1', value: '1' },
            { text: '2', value: '2' },
            { text: '3', value: '3' },
            { text: '4', value: '4' },
            { text: '5', value: '5' },
            { text: '6', value: '6' },
            { text: '7', value: '7' },
            { text: '8', value: '8' },
            { text: '9', value: '9' },
            { text: '10', value: '10' },
            { text: '11', value: '11' },
            { text: '12', value: '12' },
            { text: '13', value: '13' },
            { text: '14', value: '14' },
            { text: '15', value: '15' },
            { text: '16', value: '16' },
            { text: '17', value: '17' },
            { text: '18', value: '18' },
            { text: '19', value: '19' },
            { text: '20', value: '20' },
            { text: '21', value: '21' },
            { text: '22', value: '22' },
            { text: '23', value: '23' },
            { text: '24', value: '24' },
            { text: '25', value: '25' },
            { text: '26', value: '26' },
            { text: '27', value: '27' },
            { text: '28', value: '28' },
            { text: '29', value: '29' },
            { text: '30', value: '30' }
           
          ]
        }];
  
        events.subscribe('loadingaltas:hide',(res) =>{
          // user and time are the same arguments passed in `events.publish(user, time)`
          console.log("loadingaltas:hide")
         // alert("loadingaltas")
         this.navCtrl.setRoot(ReservasPage);
      });
  }
  
  
  getStoragedata()
  { 
    return Promise.all([this.storage.get("email"), this.storage.get("token"), this.storage.get('userid')]).
    then(values => {
      console.log("nuevareserva Your email is", values[0]);
      console.log("nuevareserva Your token is", values[1]);
      console.log("nuevareserva Your userid is", values[2]);
      if(values[2] != undefined)
      {
     	 this.options.headers.Token = values[1];
        this.options.headers.UserId = values[2].toString();
        this.sEmailFromStorage =  values[0].toString();
        this.reservaData.UserId = values[2];
      }     
   })
 }

  //ionicViewDidLoad (se carga solo una vez cuando la vista se carga en memoria)
  ionViewDidLoad(){
    this.getStoragedata();
   }
  
   reservaData = 
   { 
    "Name":"Leonardo", 
    "UserId":0,
    // "UserEmail":"leonardo@techtonik.tech", 
    "Phone":"2664221425", 
    "Persons": 3, 
    "Status":0, 
    "ReserveDate":"2018-10-12T22:00:00",
    "BarId":1 
  } 
    
  addNuevaReserva(){
    console.log(this.myReserveDate);
    this.reservaData.Name = this.sNombre;
    //this.reservaData.UserEmail = this.sEmail;
    //this.reservaData.UserId = 
    this.reservaData.Phone = this.sTel;
    this.reservaData.Persons = this.sCantPersonas;
    this.reservaData.ReserveDate = this.myReserveDate;
    console.log(this.reservaData);
    this.sMessage = "";
    this.sErrorMessage = "";
    if(this.itemid != undefined)//es un put (edicion)
    {
      console.log('es edicion');
      
      if(this.sTel != "" && this.myReserveDate != "" && this.sCantPersonas != 0)
        {         
          if(this.permiteeditar || this.statusname == "Pendiente")
          {
            this.barservice.showLoadingAltas();
            this.barservice.putReserve(this.itemid, this.reservaData, this.options).then
            (
              (res) => 
              { 
                console.log(res);
                let alert = this.alertCtrl.create({
                  title:"Nueva Reserva",
                  subTitle: res['Message'],
                  buttons: [{
                    text:'Aceptar',
                    handler: () => {
                      console.log('Aceptar clicked');
                      //this.navCtrl.push(ReservasPage);
                      this.navCtrl.setRoot(ReservasPage);
                    }
                  }]
                });
                alert.present();
               // this.sMessage = res['Message'];
                this.barservice.hideLoadingAltas();        
              },
              (error) =>
              {
                console.error(error);
                this.sErrorMessage = error.error.Message; 
                let alert = this.alertCtrl.create({
                  title:"Nueva Reserva",
                  subTitle: error.error.Message,
                  buttons: [{
                    text:'Aceptar',
                    role: 'cancel',           
                  }]
                });
                alert.present();
                this.barservice.hideLoadingAltas();    
              }
            )  
          }
          else
          {
            let alert = this.alertCtrl.create({
              title:"Nueva Reserva",
              subTitle:"No puede tener más de 3 reservas pendientes, espere a que el bar acepte alguna reserva o llame al 2664-XXXXXX",
              buttons: [{
                text:'Aceptar',
                handler: () => {
                  console.log('Aceptar clicked');
                  //this.navCtrl.push(ReservasPage);
                  this.navCtrl.setRoot(ReservasPage);
                }
              }]
            });
            alert.present();           
          }       
      }
      else
      {
        this.sErrorMessage = "faltan ingresar datos";
        //this.barservice.hideLoading();
      } 
    }
    else
    {
      console.log('es nuevo');
      if(this.sTel != "" && this.myReserveDate != "" && this.sCantPersonas != 0)
        {
          this.barservice.showLoadingAltas();
          this.barservice.postReserve(this.reservaData, this.options).then
          (
            (res) => 
            { 
              console.log(res);
              let alert = this.alertCtrl.create({
                title: "Nueva Reserva",
                subTitle: res['Message'],
                buttons: [{
                  text:'Aceptar',
                  handler: () => {
                    console.log('Aceptar clicked');
                    this.navCtrl.push(ReservasPage);
                  }
                }]
              });
              alert.present();
              //this.sMessage = res['Message']; 
              this.barservice.hideLoadingAltas();       
            },
            (error) =>
            {
              console.error(error);
              this.sErrorMessage = error.error.Message;
              let alert = this.alertCtrl.create({
                title:"Nueva Reserva",
                subTitle: error.error.Message,
                buttons: [{
                  text:'Aceptar',
                  role: 'cancel',           
                }]
              });
              alert.present();
              this.barservice.hideLoadingAltas(); 
            }
          )        
        }
        else
        {
          this.sErrorMessage = "faltan ingresar datos";
          this.barservice.hideLoadingAltas();
        }       
    }
     
   }

   cancelNuevaReserva()
   {
     //this.navCtrl.push(ReservasPage);
     this.navCtrl.setRoot(ReservasPage);
   }
  
   jsonData = {
    numbers: [
     { description: "1" },{ description: "2" },{ description: "3" },{ description: "4" },
      { description: "5" },{ description: "6" },{ description: "7" },{ description: "8" },
      { description: "9" },{ description: "10" },{ description: "11" },{ description: "12" },
      { description: "13" },{ description: "14" },{ description: "15" },{ description: "16" }, 
      { description: "17" },{ description: "18" },{ description: "19" },{ description: "20" }, 
      { description: "21" },{ description: "22" },{ description: "23" },{ description: "24" },
      { description: "25" },{ description: "26" },{ description: "27" },{ description: "28" },
      { description: "29" },{ description: "30" },{ description: "31" },{ description: "32" },
      { description: "33" },{ description: "34" },{ description: "35" },{ description: "36" },
      { description: "37" },{ description: "38" },{ description: "39" },{ description: "40" } 
    ]
  };

// basic number selection, index is always returned in the result
selectANumber() {
   this.selector.show({
    title: "Cantidad de Personas",
    items: [
      this.jsonData.numbers
    ],
    positiveButtonText: "Aceptar",
    negativeButtonText: "Cancelar",
    theme: "dark",
    wrapWheelText: true,
    defaultItems: [
         {index:0, value: this.sCantPersonas.toString()},      
       ]
  }).then(
    result => 
    {
      this.sCantPersonas = parseInt(result[0].description);      
    },
    err => console.log('Error: ', err)
    );
  }

}
