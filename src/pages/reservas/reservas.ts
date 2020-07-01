import { Component } from '@angular/core';
import { NavController, ItemGroup } from 'ionic-angular';
import { BarService } from '../../providers/bar-service/bar-service';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { NuevaReservaPage } from '../nuevareserva/nuevareserva';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InitPage } from '../init/init';
import { App } from 'ionic-angular';

@Component({
  selector: 'page-reservas',
  templateUrl: 'reservas.html'
})
export class ReservasPage {
  gridDataFromAPI: any = [];
  sMessage: string;
  sErrorMessage: string;
  id: number;
  gridDataPendientes: any = [];
  gridDataAceptadas: any = [];
  gridDataRechazadas:any = [];
  gridDataFinalizadas:any = [];
  gridDataCanceladas:any = [];
  numeromaxpendientes: number;
  permiteeditar: boolean;
  isDisabled:boolean;
  verPendientes:boolean;
  verAceptadas:boolean;
  verRechazadas:boolean;
  verFinalizadas:boolean;
  verCanceladas:boolean;
  verloadmoreRechazadas:boolean;
  verloadmoreFinalizadas:boolean;
  verloadmoreCanceladas:boolean;
  cantReservasRechazadas: number;
  cantReservasFinalizadas: number;
  cantReservasCanceladas: number;
  sindatos:boolean = false;

  interval: any;
  options = {
    headers: {
      'Content-Type': 'application/json',
      'Token':'',
      'UserId':'',
      'ReservasPendientes':'3',
      'ReservasAceptadas':'3',
      'ReservasRechazadas':'3',
      'ReservasFinalizadas':'3',
      'ReservasCanceladas':'3'
    }
  };

  constructor(public navCtrl: NavController, public barservice: BarService, private alertCtrl: AlertController, 
    private storage: Storage,public app: App, public dataservice: DataServiceProvider) {
  }
  
  getStoragedata()
  { 
    return Promise.all([this.storage.get("email"), this.storage.get("token"), this.storage.get('userid')]).
    then(values => {
      console.log("reserva Your email is", values[0]);
      console.log("reserva Your token is", values[1]);
      console.log("reserva Your userid is", values[2]);
      if(values[2] != undefined)
      {
     	 this.options.headers.Token = values[1];
        this.options.headers.UserId = values[2].toString();
        this.getconfigdata();
      } 
      this.barservice.hideLoading()
   })  
 }

  //ionicViewDidLoad (se carga solo una vez cuando la vista se carga en memoria)
  ionViewDidLoad(){
    this.barservice.showLoading();
    this.getStoragedata(); 
   }
   
   ionViewWillEnter()
   {     
    //this.startTimer();//cada cierto tiempo llamar la funcion
    //this.load();   
    this.getStoragedata(); 
   }

   ionViewWillLeave() //cada vez que sale de la pagina
  {
    console.log("RESERVAS - ionViewWillLeave");
   // clearInterval(this.interval);
  }

  getconfigdata()
  {
    console.log("config data:");
    
    this.dataservice.getConfigFile().subscribe
    (
      data => { 
        console.log(data);
        this.options.headers.ReservasPendientes = data.CantidadReservasPendientesPermitidos.toString();
        this.numeromaxpendientes = data.CantidadReservasPendientesPermitidos;
        this.options.headers.ReservasAceptadas = data.CantidadReservasAceptadasInicial.toString();
        this.options.headers.ReservasRechazadas = data.CantidadReservasRechazadasInicial.toString();
        this.options.headers.ReservasFinalizadas = data.CantidadReservasFinalizadasInicial.toString();
        this.options.headers.ReservasCanceladas = data.CantidadReservasCanceladasInicial.toString();
       // this.config = data;
        this.load(); 
      },
      err => {
        console.log(err);      
      },
    );
  }

   load()
   {
     this.barservice.showLoading();
     console.log("RESERVAS****************************load method");
     this.gridDataFromAPI = [];
     this.sErrorMessage = ""; 
     this.sMessage = "";
     this.barservice.getReserves(this.options).then
     (
       (res) => 
       { 
         this.gridDataFromAPI = JSON.parse(res['Data'].toString());
         console.log("GRID DATA: " + res['Data']);
         if(this.gridDataFromAPI.length > 0)
         {
            if(this.gridDataFromAPI[0].ItemsCount != null && this.gridDataFromAPI[0].ItemsCount != undefined)
            {  
                this.cantReservasRechazadas = this.gridDataFromAPI[0].ItemsCount.ReservasRechazadas;
                this.cantReservasFinalizadas = this.gridDataFromAPI[0].ItemsCount.ReservasFinalizadas;
                this.cantReservasCanceladas = this.gridDataFromAPI[0].ItemsCount.ReservasCanceladas;
            }
              this.gridDataPendientes = this.filterItems("Pendiente");
              console.log("gridDataPendientes: " + this.gridDataPendientes);
              if(this.gridDataPendientes.length == 0)
              {
                this.verPendientes = false;
              }
              else
              {
                this.verPendientes = true;         
              }
              
              if(this.gridDataPendientes.length < this.numeromaxpendientes)
              {
                  this.permiteeditar = true;
                  this.isDisabled = false;
                  console.log("isdisabled: " + this.isDisabled + " permiteeditar " + this.permiteeditar);
              }
              else
                { 
                  this.permiteeditar = false;
                  this.isDisabled = true;
                  console.log("isdisabled: " + this.isDisabled + " permiteeditar " + this.permiteeditar);
                }

              this.gridDataAceptadas = this.filterItems("Aceptada");
              console.log("gridDataAceptadas: " + this.gridDataAceptadas);
              if(this.gridDataAceptadas.length == 0)
              {
                this.verAceptadas = false;
              }
              else
                this.verAceptadas = true;

              this.gridDataRechazadas = this.filterItems("Rechazada");
              console.log("gridDataRechazadas: " + this.gridDataRechazadas.length);
              if(this.gridDataRechazadas.length == 0)
              {
                this.verRechazadas = false;
              }
              else
              {          
                this.verRechazadas = true;
                if(this.gridDataRechazadas.length < this.cantReservasRechazadas)
                {
                    this.verloadmoreRechazadas = true;
                }
                else
                {
                    this.verloadmoreRechazadas = false;
                }
            }

            this.gridDataFinalizadas = this.filterItems("Finalizada");
            console.log("gridDataFinalizadas: " + this.gridDataFinalizadas.length);
            if(this.gridDataFinalizadas.length == 0)
            {
              this.verFinalizadas = false;        
            }
            else
            {
              this.verFinalizadas = true;
              if(this.gridDataFinalizadas.length < this.cantReservasFinalizadas)
              {
                  this.verloadmoreFinalizadas = true;
              }
              else
              {
                  this.verloadmoreFinalizadas = false;
              }
            }

            this.gridDataCanceladas = this.filterItems("Cancelada");
            console.log("gridDataCanceladas: " + this.gridDataCanceladas.length);
            if(this.gridDataCanceladas.length == 0)
            {
              this.verCanceladas = false;        
            }
            else
            {
              this.verCanceladas = true;
              if(this.gridDataCanceladas.length < this.cantReservasCanceladas)
              {
                  this.verloadmoreCanceladas = true;
              }
              else
              {
                  this.verloadmoreCanceladas = false;
              }
            }
          }//end if gridDataFromAPI
          else
          {
             this.sindatos = true;
          }
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

    filterItems(searchTerm){
      return this.gridDataFromAPI.filter((item) => {
       return item.StatusName.toLowerCase().indexOf(
         searchTerm.toLowerCase()) > -1;
       });
      }

   reservaData = 
   { 
    "Name":"Leonardo", 
    "UserEmail":"leonardo@techtonik.tech", 
    "Phone":"2664221425", 
    "Persons": 3, 
    "Status":0, 
    "ReserveDate":"2018-10-12T22:00:00" 
  } 
    
  
   goNuevaReserva(): void {
    if(!this.isDisabled)
       this.navCtrl.push(NuevaReservaPage);
    else
    {
      let alert = this.alertCtrl.create({
        title: "Nueva Reserva",
        subTitle: "Ya supero el limite de reservas pendientes, espere confirmaciones",
        buttons: [{
          text:'Aceptar',
          role: 'cancel',           
        }]
      });
      alert.present();
    }
    
       
   }

   editReserva(tiporeserva, rowIndex)
   { 
    let griditem;   
    if(tiporeserva == "Pendiente")
       griditem = this.gridDataPendientes[rowIndex];
    else if(tiporeserva == "Aceptada")
       griditem = this.gridDataAceptadas[rowIndex];
    else if(tiporeserva == "Rechazada")
       griditem = this.gridDataRechazadas[rowIndex];
    else if(tiporeserva == "Finalizada")
       griditem = this.gridDataFinalizadas[rowIndex];

    this.navCtrl.push(NuevaReservaPage,
      {
          id: griditem.Id,
          name: griditem.Name,
          email: griditem.UserEmail,
          phone: griditem.Phone,
          persons: griditem.Persons,
          reservadate: griditem.ReserveDate,
          permiteeditar: this.permiteeditar,
          status: griditem.StatusName,
          title: "Editar Reserva"
       });
   }

   deleteReserva(tiporeserva,rowIndex): void{ 
    this.sMessage = "";
    this.sErrorMessage = "";
    let griditem;   
    if(tiporeserva == "Pendiente")
       griditem = this.gridDataPendientes[rowIndex];
    else if(tiporeserva == "Aceptada")
       griditem = this.gridDataAceptadas[rowIndex];
    else if(tiporeserva == "Rechazada")
       griditem = this.gridDataRechazadas[rowIndex];
    else if(tiporeserva == "Finalizada")
       griditem = this.gridDataFinalizadas[rowIndex];
    else if(tiporeserva == "Cancelada")
       griditem = this.gridDataCanceladas[rowIndex];

    this.id = griditem.Id;
    let alert = this.alertCtrl.create({
      title: 'Confirmar eliminacion',
      message: '¿Quiere eliminar la reserva?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Aceptar clicked');
               this.barservice.deleteReserve(this.id, this.options).then
              (
                (res) => 
                { 
                  console.log(res);
                 // this.sMessage = res['Message'];
                  this.load();
                },
                (error) =>
                {
                  console.error(error);
                  console.log(error.error.Message);
                  this.sErrorMessage = error.error.Message; 
                }
              )
          }
        }
      ]
    });
    alert.present();

    /**/
  }

  loadmore(tiporeserva)
  {
    if(tiporeserva == "Rechazada")
    {
      let cantrechazadaactual = parseInt(this.options.headers.ReservasRechazadas);
      cantrechazadaactual += 3;
      this.options.headers.ReservasRechazadas = cantrechazadaactual.toString();
      console.log(cantrechazadaactual);
      this.load();
    }
    if(tiporeserva == "Finalizada")
    {
      let cantfinalizadaactual = parseInt(this.options.headers.ReservasFinalizadas);
      cantfinalizadaactual += 3;
      this.options.headers.ReservasFinalizadas = cantfinalizadaactual.toString();
      console.log(cantfinalizadaactual);
      this.load();
    }
  }

  startTimer()
   {
     this.interval = setInterval(function(){
       //alert("alerta cada 1 minuto");
       this.load(); //por las dudas actualizar el listado de pedidos       
     }.bind(this),60000)
   }


}//end class
