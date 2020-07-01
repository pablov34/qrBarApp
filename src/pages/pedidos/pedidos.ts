import { Component, ModuleWithComponentFactories } from '@angular/core';
import { NavController, DateTime } from 'ionic-angular';
import { BarService } from '../../providers/bar-service/bar-service';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { NuevoPedidoOrderQrPage } from '../nuevopedidoorderqr/nuevopedidoorderqr';
import { NuevoPedidoOrderWQrPage } from '../nuevopedidoorderwqr/nuevopedidoorderwqr';
import { NuevoPedidoOrderToRetreatPage } from '../nuevopedidoordertoretreat/nuevopedidoordertoretreat';
import { Modal, ModalController, ModalOptions, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { InitPage } from '../init/init';
import { App } from 'ionic-angular';

@Component({
  selector: 'page-pedidos',
  templateUrl: 'pedidos.html'
})
export class PedidosPage {
  @ViewChild(Slides) slides: Slides;
  gridDataFromAPI: any = []; 
  gridDataConfirmado: any = []; 
  gridDataEntregado: any = []; 
  gridDataRechazado:any = [];
  gridDataCancelado:any = [];
  selectedScanedProducts: any = [];
  isDisabledVP: boolean;
  isDisabledNP: boolean;
  haypedidoencurso:boolean;
  puederepetir:boolean;

  verPedidosEnCurso: boolean;
  verPedidosEntregados: boolean;
  verPedidosRechazados: boolean;
  verPedidosCancelados: boolean;
  
  verloadmoreEntregado: boolean;
  cantPedidosEntregados:number;
  verloadmoreRechazado: boolean;
  cantPedidosRechazados: number;
  verloadmoreCancelado: boolean;
  cantPedidosCancelados: number;

  interval: any;
  sindatos:boolean = false;
  config: any;
  barid: string;
  configDataFromAPI: any;
  EnableOrderToRetreat: boolean;
  EnableOrderWQr: boolean;
  EnableOrderQr: boolean;
  EnableCallMozo: boolean;
  EnableCloseBarTable: boolean;
  DisableCloseBarTable: boolean = false; //para controlar si notificacion de mesa cerrada

  continueordertype: string;//en caso de continuar pedido,
  thistime: Date;
  ordertime: Date;
  tableqrcode: string;

  options = {
    headers: {
      'Content-Type': 'application/json',
      'Token':'',
      'UserId':'',
      'ItemsEnCurso':'3',
      'ItemsEntregados':'3',
      'ItemsRechazados':'3',
      'ItemsCancelados':'3',
    }
  };

  
  gridData = [{ image: "/assets/imgs/bar1.jpg", nombre:"Bar1", url:"http://www.google.com", map:"https://goo.gl/maps/ghZDh5YoezD2" },
               { image: "/assets/imgs/bar2.jpg", nombre:"Bar2", url:"http://www.google.com", map:"https://goo.gl/maps/ghZDh5YoezD2" },
               { image: "/assets/imgs/bar3.jpg", nombre:"Bar3", url:"http://www.google.com", map:"https://goo.gl/maps/ghZDh5YoezD2" }]
 
               
  constructor(public navCtrl: NavController, public barservice: BarService, public dataservice: DataServiceProvider, 
    public modalCtrl: ModalController, private storage: Storage, private alertCtrl: AlertController,public app: App) 
  {

  }
  
  //ionicViewDidLoad (se carga solo una vez cuando la vista se carga en memoria)
  ionViewDidLoad(){
    // this.gridDataFromAPI = this.barservice.getBars();
     console.log("*****ionViewDidLoad una sola vez*****");

     this.getOrderStoragedata();
     //this.getStoragedata();//por las dudas actualizar el listado de pedidos             //this.load(); 
   }

   ionViewWillEnter() //cada vez que entra a la pagina
  {
    console.log("PEDIDOS - ionViewWillEnter");
    console.log(this.options);

    //this.getOrderStoragedata(); //por las dudas actualizar el estado botones
    this.getStoragedata();//por las dudas actualizar el listado de pedidos             //this.load();  
  }

  ionViewWillLeave() //cada vez que sale de la pagina
  {
    console.log("PEDIDOS - ionViewWillLeave");
   // clearInterval(this.interval);
  }

  getOrderStoragedata()
 {
   console.log("GETORDERSTORAGEDATE");
  return Promise.all([this.storage.get("selectedscanedproducts"), this.storage.get("continueordertype")]).
  then(values => {
    console.log("nuevopedido selectedscanedproducts ", values[0]);
    this.selectedScanedProducts = values[0];
    
       if(this.selectedScanedProducts != null && this.selectedScanedProducts.length > 0)
       {
         this.isDisabledVP = false;//mostrar boton VER/CONTINUAR PEDIDO 
         this.isDisabledNP = true;//ocultar boton NUEVO PEDIDO
         this.haypedidoencurso = true;
         this.continueordertype = values[1];
       }
       else
       {
         this.isDisabledVP = true;//ocultar boton VER/CONTINUAR PEDIDO 
         this.isDisabledNP = false;//mostrar boton NUEVO PEDIDO
         this.haypedidoencurso = false;
       }
      // this.getStoragedata(); //por las dudas actualizar el listado de pedidos             //this.load(); 
 })
 }

  getStoragedata()
  { 
    console.log("GETSTORAGEDATE");
    return Promise.all([this.storage.get("email"), this.storage.get("token"), this.storage.get('userid'),
    this.storage.get('DisableCloseBarTable')]).
    then(values => {
      console.log("pedidos Your email is", values[0]);
      console.log("pedidos Your token is", values[1]);
      console.log("pedidos Your userid is", values[2]);
      if(values[2] != undefined)
      {
     	 this.options.headers.Token = values[1];
        this.options.headers.UserId = values[2].toString();
        this.optionsforconfig.headers.Token = values[1];
        this.optionsforconfig.headers.UserId = parseInt(values[2].toString());
        
        if(values[3] != undefined)
        {
            if(values[3].toString() == 'true')
                 this.DisableCloseBarTable = true; //hay notificación de mesa cerrada
             else
                 this.DisableCloseBarTable = false;
         }

        this.getconfigdata();
      }      
        
   }) 
 }
  
  getconfigdata()
  {
    console.log("config data:");
    
    this.dataservice.getConfigFile().subscribe
    (
      data => { 
        console.log(data);
        this.options.headers.ItemsEnCurso = data.CantidadPedidosPendientesPermitidos.toString();
        this.options.headers.ItemsRechazados = data.CantidadPedidosRechazadosInicial.toString();
        this.options.headers.ItemsEntregados = data.CantidadPedidosEntregadosInicial.toString();
        this.options.headers.ItemsCancelados = data.CantidadPedidosCanceladosInicial.toString();
        this.optionsforconfig.headers.BarId = parseInt(data.BarId);
        this.config = data;
        this.getconfigdataapi();
      },
      err => {
        console.log(err);      
      },
    );
  }

  optionsforconfig = {
    headers: {
      'Content-Type': 'application/json',
      'Token':'',
      'UserId':0,
      'BarId':0
    }
  };

  getconfigdataapi()
  {
    this.dataservice.getConfigApi(this.optionsforconfig).then
        (
          (res) => 
          {  
            let confDataFromAPI = JSON.parse(res['_body'].toString());
            this.configDataFromAPI = JSON.parse(confDataFromAPI['Data'].toString());
            this.EnableOrderToRetreat = this.configDataFromAPI.EnableOrderToRetreat;
            this.EnableOrderWQr = this.configDataFromAPI.EnableOrderWQr;
            this.EnableOrderQr = this.configDataFromAPI.EnableOrderQr;
            this.EnableCallMozo = this.configDataFromAPI.EnableCallMozo;
            this.EnableCloseBarTable = this.configDataFromAPI.EnableCloseBarTable;
            console.log("EnableOrderToRetreat");
            console.log(this.EnableOrderToRetreat);
            this.load();       
          },
          (error) =>
          {
             let message;
             console.error(error);
          }
        )
  }

   load()
   {
    this.barservice.showLoading();
    this.gridDataFromAPI = [];
    this.EnableCallMozo = false;
    this.EnableCloseBarTable = false;
        
    this.barservice.getPedidos(this.options).then
    (
      (res) => 
      {        
        this.gridDataFromAPI = JSON.parse(res['Data'].toString());
        if(this.gridDataFromAPI.length > 0)
        {
          console.log("GridDataFromAPI no es undefined");
          console.log(this.gridDataFromAPI);
          if(this.gridDataFromAPI[0].ItemsCount != null && this.gridDataFromAPI[0].ItemsCount != undefined)
          {       
            this.cantPedidosEntregados = this.gridDataFromAPI[0].ItemsCount.ItemsEntregados;
            this.cantPedidosRechazados = this.gridDataFromAPI[0].ItemsCount.ItemsRechazados;
            this.cantPedidosCancelados = this.gridDataFromAPI[0].ItemsCount.ItemsCancelados;
          }
          console.log("GRID DATA: " + this.gridDataFromAPI + " cantPedidosEntregados " + this.cantPedidosEntregados);

          //CONFIRMADOS/EN CURSO
          this.gridDataConfirmado = this.filterItems("Confirmado"); //Confirmado = En Curso
          console.log("gridConfirmados: " + this.gridDataConfirmado);
          if(this.gridDataConfirmado.length == 0)
          {
            this.verPedidosEnCurso = false;
            this.EnableCallMozo = false; //permitir pedir asistencia
          }
          else
          {
            this.verPedidosEnCurso = true;
            for(let i=0;i<this.gridDataConfirmado.length;i++)//Confirmado = En Curso
            {
              this.thistime = new Date();
              this.ordertime = this.gridDataConfirmado[i].OrderDate;
              let difference = new Date(this.thistime).getTime() - new Date(this.ordertime).getTime();
              //alert(difference/3600000);
                if(this.gridDataConfirmado[i].OrderTypeId == 1)//ordertype En Bar
                {
                    if(this.gridDataConfirmado[i].StatusAccount == 0) //cuenta abierta StatusAccount = 0
                    {
                     // alert("permitir");
                      this.EnableCallMozo = true; //permitir pedir asistencia
                      this.tableqrcode = this.gridDataConfirmado[i].BarTableQrcode;
                      break;
                    }
                    else
                    {
                      this.EnableCallMozo = false; //no permitir pedir asistencia
                      //alert("no permitir");
                    }
                }
                else
                {
                  this.EnableCallMozo = false; //no permitir pedir asistencia
                  //alert("ordertype no permitir");
                }
            }
          }
                        
          if(this.gridDataConfirmado.length >= this.config.CantidadPedidosPendientesPermitidos || this.haypedidoencurso == true)
          {
            this.isDisabledNP = true;
            this.puederepetir = false;
          }
          else
          {
            this.isDisabledNP = false;
            this.puederepetir = true;
          }
          //CONFIRMADOS/EN CURSO

          //ENTREGADOS
          this.gridDataEntregado = this.filterItems("Entregado");
          console.log("gridEntregados: " + this.gridDataEntregado);
          if(this.gridDataEntregado.length == 0)
          {
            this.verPedidosEntregados = false;
            this.EnableCloseBarTable = false;
            //alert("no permitir closebartable xq cantidad = 0");
          }
          else
          {
            this.verPedidosEntregados = true;
            for(let i=0;i<this.gridDataEntregado.length;i++)//Entregado
            {
              this.thistime = new Date();
              this.ordertime = this.gridDataEntregado[i].OrderDateEnd;
              let difference = new Date(this.thistime).getTime() - new Date(this.ordertime).getTime();
              //alert(difference/3600000);
                if(this.gridDataEntregado[i].OrderTypeId == 1)//ordertype En Bar
                {
                  //cuenta abierta StatusAccount = 0
                    if(this.gridDataEntregado[i].StatusAccount == 0)
                    {                    
                      console.log("StatusAccount " + this.gridDataEntregado[i].StatusAccount)
                      if(!this.EnableCallMozo)//si hay algun pedido en curso -permite llamar mozo-
                      {                       //NO permitir pedir cuenta
                        this.EnableCloseBarTable = true;
                        this.tableqrcode = this.gridDataEntregado[i].BarTableQrcode;

                        if(this.config.EnablePedidoAsistencia == "true")
                        {
                          console.log("ENABLEPEDIDOASISTENCIA " + this.config.EnablePedidoAsistencia)
                          //si no hay pedidos en curso (EnableCallMozo = false) 
                          //y SIEMPRE SE PERMITE PEDIR ASISTENCIA (EnablePedidoAsistencia = "true")
                          //y hay al menos un pedido entregado con menos de 2 hs
                          //y la cuenta abierta StatusAccount = 0
                          //habilitar pedir asistencia
                          this.EnableCallMozo = true; //permitir pedir asistencia
                          //break;
                        } 
                        break;
                      }                     
                    }
                    else
                    {
                      this.EnableCloseBarTable = false;
                      //alert("no permitir closebartable");
                    }
                }
                else
                {
                  this.EnableCloseBarTable = false;
                  //alert("ordertype no permitir closebartable");
                }
            }
            console.log("ENABLECALLMOZO: " + this.EnableCallMozo);
            console.log("ENABLECLOSEBARTABLE: " + this.EnableCloseBarTable);
            console.log("DISABLECLOSEBARTABLE: " + this.DisableCloseBarTable);
            if(this.gridDataEntregado.length < this.cantPedidosEntregados)
                this.verloadmoreEntregado = true;
            else
                this.verloadmoreEntregado = false;
          }
          //ENTREGADOS

          //PEDIDOS RECHAZADOS
          this.gridDataRechazado = this.filterItems("Rechazado");
          console.log("gridRechazados: " + this.gridDataRechazado);
          if(this.gridDataRechazado.length == 0)
          {
            this.verPedidosRechazados = false;         
          }
          else
          {
            this.verPedidosRechazados = true;
            
            if(this.gridDataRechazado.length < this.cantPedidosRechazados)
                this.verloadmoreRechazado = true;
            else
                this.verloadmoreRechazado = false;
          }
          //PEDIDOS RECHAZADOS
          
          //PEDIDOS CANCELADOS
          this.gridDataCancelado = this.filterItems("Cancelado");
          console.log("gridCancelados: " + this.gridDataCancelado);
          if(this.gridDataCancelado.length == 0)
          {
            this.verPedidosCancelados = false;
          }
          else
          {
            this.verPedidosCancelados = true;
            if(this.gridDataCancelado.length < this.cantPedidosCancelados)
                this.verloadmoreCancelado = true;
            else
                this.verloadmoreCancelado = false;
          }
          //PEDIDOS CANCELADOS
          this.barservice.hideLoading();
        }//end if this.gridDataFromAPI != null
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
                console.log(error.error.Message);
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
     return item.Status.toLowerCase().indexOf(
       searchTerm.toLowerCase()) > -1;
     });
    }

   openModal(tipopedido, rowIndex) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false,
      showBackdrop: true
    };
    
    let griditem;   
    if(tipopedido == "PedidoEnCurso")
       griditem = this.gridDataConfirmado[rowIndex];
    if(tipopedido == "PedidoEntregado")
       griditem = this.gridDataEntregado[rowIndex];
    if(tipopedido == "PedidoRechazado")
       griditem = this.gridDataRechazado[rowIndex];
    if(tipopedido == "PedidoCancelado")
       griditem = this.gridDataCancelado[rowIndex];   
    /*const myModalData = {
      name: 'Paul Halliday',
      occupation: 'Developer'
    };*/
    /*this.detailsummaryitems = data.DetailSummary.split('.');
    this.total = data.Total;
    this.delaytimerange = data.DelayTimeRange;
    this.orderdetails = data.OrderDetails;*/
    let str = griditem.DetailSummary.split('.');
    let detailsum = '';
    let delaytime = '';
    for(let i=0;i<str.length;i++)
    {
      detailsum += str[i] + "<br>";
    }
    let dateString = griditem.OrderDateEnd;
    let newDate = new Date(dateString);
    if(griditem.Status == "Confirmado")
    {
        delaytime =
        '<ion-icon large="" name="time" role="img" class="icon icon-md ion-md-time" aria-label="time" ng-reflect-name="time"></ion-icon>'+
        '<div class="entrega" >' +
          '<p> EN CAMINO </p>' +
          '<div>' + griditem.DelayTimeRange + '</div>'+
        '</div>';
    }
    else if(griditem.Status == "Entregado")
    {
      delaytime = 
      '<div class="entrega">' +
        '<p> ENTREGADO </p>' +
        '<div>' + newDate.toLocaleString() + '</div>'+
      '</div>';
    }
    else if(griditem.Status == "Rechazado")
    {
      delaytime =
      '<div  class="entrega" >' +
        '<p> RECHAZADO </p>' +
        '<div>' + newDate.toLocaleString() + '</div>'+
      '</div>';
    }
    else if(griditem.Status == "Cancelado")
    {
      delaytime =
      '<div  class="entrega" >' +
        '<p> CANCELADO </p>' +
        '<div>' + newDate.toLocaleString() + '</div>'+
      '</div>';
    }
    let alert = this.alertCtrl.create({
      title: '<h3>Detalle de Pedido</h3>',
      message: '<div class="container">'+
                '<div>' +        
                     '<div class="textsummary">' + detailsum + '</div>'+                           
               '</div>'+
                   delaytime + 
                '<div class="total">TOTAL $ ' + griditem.Total + '</div>'  + 
                '<div class="total">' + griditem.OrderTypeName + '</div>' +
          '</div>',
      buttons: [
        {
          text:'Cerrar',
          role: 'cancel',  
        }
      ]
    });
    alert.present();

   /* const myModal: Modal = this.modalCtrl.create('ModalprodqtyPage', { data: griditem }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      console.log("I have dismissed.");
      console.log(data);
    });

    myModal.onWillDismiss((data) => {
      console.log("I'm about to dismiss");
      console.log(data);
    });*/
  }

  loadmore(tipopedido)
  {
    if(tipopedido == "Entregado")
    {
      let cantentregadosactual = parseInt(this.options.headers.ItemsEntregados);
      cantentregadosactual += 3;
      this.options.headers.ItemsEntregados = cantentregadosactual.toString();
      console.log(cantentregadosactual);
      this.load();
    }
    if(tipopedido == "Rechazado")
    {
      let cantrechazadosactual = parseInt(this.options.headers.ItemsRechazados);
      cantrechazadosactual += 3;
      this.options.headers.ItemsRechazados = cantrechazadosactual.toString();
      console.log(cantrechazadosactual);
      this.load();
    }
    if(tipopedido == "Cancelado")
    {
      let cantcanceladosactual = parseInt(this.options.headers.ItemsCancelados);
      cantcanceladosactual += 3;
      this.options.headers.ItemsCancelados = cantcanceladosactual.toString();
      console.log(cantcanceladosactual);
      this.load();
    }
  }

  goNuevoPedidoPage(orden): void {
    if(!this.isDisabledNP)
    {
      if(orden == "EnableOrderToRetreat")
      {
        let alert = this.alertCtrl.create({
          title: 'Nuevo Pedido',
          message: ' ¿Desea hacer un pedido a retirar? ',
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
               // this.storage.set('DisableCloseBarTable','false'); 
                this.navCtrl.push(NuevoPedidoOrderToRetreatPage);  
              }
            }
          ]
        });
        alert.present();
      }
      else if(orden == "EnableOrderWQr")
      {
       // this.storage.set('DisableCloseBarTable','false'); 
        this.navCtrl.push(NuevoPedidoOrderWQrPage); 
      }
      else if(orden == "EnableOrderQr")
      {
        //this.storage.set('DisableCloseBarTable','false'); 
        this.navCtrl.push(NuevoPedidoOrderQrPage); 
      }
       
    }
    else
    {
      let alert = this.alertCtrl.create({
        title: "Nuevo Pedido",
        subTitle: "Ya supero el limite de pedidos en curso, espere que alguno sea entregado",
        buttons: [{
          text:'Aceptar',
          role: 'cancel',           
        }]
      });
      alert.present();
    }
    //this.openModal();
 }

 
 goEditPedidoPage():void{
    // this.navCtrl.push(NuevoPedidoPage);
    if(this.continueordertype == "OrderToRetreat")
    {
      this.navCtrl.push(NuevoPedidoOrderToRetreatPage);
    }
    if(this.continueordertype == "OrderQr")
    {
      this.navCtrl.push(NuevoPedidoOrderQrPage);
    }
    if(this.continueordertype == "OrderWQr")
    {
      this.navCtrl.push(NuevoPedidoOrderWQrPage);
    }
 }

  RepetirPedido(tipopedido, rowIndex)
  { 
    let griditem;   
    if(tipopedido == "PedidoEntregado")
       griditem = this.gridDataEntregado[rowIndex];
    if(tipopedido == "PedidoRechazado")
       griditem = this.gridDataRechazado[rowIndex];
    if(tipopedido == "PedidoCancelado")
       griditem = this.gridDataCancelado[rowIndex];
    
    if(griditem.OrderTypeId == 1)
    {
      //alert("Order Type Id 1");
      if(this.EnableOrderQr)
      {
        this.navCtrl.push(NuevoPedidoOrderQrPage, 
          {
            data: griditem
          });
      }
      else if(this.EnableOrderWQr)
      {
        this.navCtrl.push(NuevoPedidoOrderWQrPage, 
          {
            data: griditem
          });
      }
      else
      {
        let alert = this.alertCtrl.create({
          title: "Nuevo Pedido",
          subTitle: "En este momento no se permite repetir este tipo de pedido",
          buttons: [{
            text:'Aceptar',
            role: 'cancel',           
          }]
        });
        alert.present();
      }
    }
    if(griditem.OrderTypeId == 2)
    {
      if(this.EnableOrderToRetreat)
      {
        //alert("Order Type Id 2");
        this.navCtrl.push(NuevoPedidoOrderToRetreatPage, 
        {
          data: griditem
        });
      }
      else
      {
        let alert = this.alertCtrl.create({
          title: "Nuevo Pedido",
          subTitle: "En este momento no se permite repetir este tipo de pedido",
          buttons: [{
            text:'Aceptar',
            role: 'cancel',           
          }]
        });
        alert.present();
      }
    }
       //revisar esto, hay q implementar
    /*this.navCtrl.push(NuevoPedidoPage,
       {
         data: griditem
       });*/
  }

  optionsforordercall = {
    headers: {
      'Content-Type':'application/json',
      'Token':'',
      'UserId':'',
      'OrderCallType':'0',
      'BarTableQrCode':''
    }
  };
  closeBarTable()
  {
    this.barservice.showLoading();
    this.optionsforordercall.headers.Token = this.options.headers.Token.toString();
    this.optionsforordercall.headers.UserId = this.options.headers.UserId.toString();
    this.optionsforordercall.headers.BarTableQrCode = this.tableqrcode.toString();
    this.optionsforordercall.headers.OrderCallType = "1";
   

      let alertp = this.alertCtrl.create({
        title: 'Pedido',
        message: '¿Desea solicitar la cuenta?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              this.barservice.hideLoading();
            }
          },
          {
            text: 'Si',
            handler: () => {
              console.log('Aceptar clicked');
              console.log(this.optionsforordercall);
                  this.barservice.putOrderCall(this.optionsforordercall).then
                  (
                    (res) => 
                    { 
                      this.barservice.hideLoading();
                      console.log(res);
                      let alert = this.alertCtrl.create({
                        title: "Pedido",
                        subTitle: res['Message'],
                        buttons: [{
                          text:'Aceptar',  
                          role: 'cancel'       
                        }]
                      });
                      alert.present();  
                        
                    },
                    (error) =>
                    {
                      this.barservice.hideLoading();
                      console.error(error);
                      //this.sErrorMessage = error.error.Message;
                      let alert = this.alertCtrl.create({
                        title: "Pedido",
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
          }
        ]
      });
      alertp.present();
  }

  callMozo()
  {
    this.barservice.showLoading();
    this.optionsforordercall.headers.Token = this.options.headers.Token.toString();
    this.optionsforordercall.headers.UserId = this.options.headers.UserId.toString();
    this.optionsforordercall.headers.BarTableQrCode = this.tableqrcode.toString();
    this.optionsforordercall.headers.OrderCallType = "0";


    let alertp = this.alertCtrl.create({
      title: 'Pedido',
      message: '¿Desea pedir asistencia?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Si',
          handler: () => {
            console.log('Aceptar clicked');
            console.log(this.optionsforordercall);
                   this.barservice.putOrderCall(this.optionsforordercall).then
                    (
                      (res) => 
                      { 
                        this.barservice.hideLoading();
                        console.log(res);
                        let alert = this.alertCtrl.create({
                          title: "Pedido",
                          subTitle: res['Message'],
                          buttons: [{
                            text:'Aceptar',  
                            role: 'cancel'       
                          }]
                        });
                        alert.present();     
                      },
                      (error) =>
                      {
                        this.barservice.hideLoading();
                        console.error(error);
                        //this.sErrorMessage = error.error.Message;
                        let alert = this.alertCtrl.create({
                          title: "Pedido",
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
        }
      ]
    });
    alertp.present();
  }

   slideChanged()
   {let currentIndex = this.slides.getActiveIndex();
     //console.log('Current index is', currentIndex);
   }

   startTimer()
   {
     this.interval = setInterval(function(){
       //alert("alerta cada 1 minuto");
       //this.load(); //por las dudas actualizar el listado de pedidos  
       
       // Schedule a single notification
       
     }.bind(this),60000)
   }
 }
 

 
