import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Navbar } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { App } from 'ionic-angular';
import { BarService } from '../../providers/bar-service/bar-service';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { PedidosPage } from '../pedidos/pedidos';
import { stringify } from '@angular/core/src/render3/util';

@Component({
  selector: 'page-nuevopedidoordertoretreat',
  templateUrl: 'nuevopedidoordertoretreat.html'
})

export class NuevoPedidoOrderToRetreatPage {
  products:any = []; //productos desde la API
  selectedProduct: any;
  thisbar:boolean = false;
  productFound:boolean = false;
  sTitle: string;
  loaded: boolean = true;
  selectedScanedProducts: any = [];
  scanedprod: any;
  prod:any;
  repeated: any;
  sConfirmar: string;
  sum : number = 0;
  todayDate: Date = new Date();
  userid: number;
  sTest: string;
  selectedScanedProductsFromStorage: any = [];
  bSendedOrder: boolean = false;
  itemid: number;
  data: any;
  orden: string;
  isrepeatedpedido: boolean = false;
  nummesa:number;
  simpleColumns: any;
  verpedido: boolean = true; //ver o no el pedido, o ver agregar producto sin qr
  productswithqty:any = [];
  makescanbar: boolean;
  makescanprod: boolean;
  
  // Property used to store the callback of the event handler to unsubscribe to it when leaving this page
  public unregisterBackButtonAction: any;


  options = {
    headers: {
      'Content-Type': 'application/json',
      'Token':'',
      'UserId':''//no usa table(mesa)
    }
  };

  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner,
    private toast: Toast,
    public barService: BarService,
    private selector: WheelSelector, 
    private storage: Storage,
    public barservice: BarService,
    private alertCtrl: AlertController,
    public navParams: NavParams,
    public platform: Platform) 
    {
      console.log(NavParams);
      this.data = null; //reset
      this.orden = null; //reset
      if(navParams != null)
      {
         this.data = navParams.get('data');
         //this.orden = navParams.get('orden');
         if(this.data != null)
         {
           console.log('data from repetir pedidos: NO NULL');
           console.log(this.data);
           this.isrepeatedpedido = true;
           
           //cargar desde llamada Repetir Pedido. Se llena selectedScanedProducts
           for(let i = 0; i<this.data.OrderDetails.length; i++)
           {
            this.scanedprod={
              Id:this.data.OrderDetails[i].ProductId,
              ImageUrl: this.data.OrderDetails[i].ImageUrl,
              Description: this.data.OrderDetails[i].ProductName,
              Name: this.data.OrderDetails[i].ProductName,
              Price: this.data.OrderDetails[i].Price,
              UnitPrice: (this.data.OrderDetails[i].Price / this.data.OrderDetails[i].Quantity),
              Qty: this.data.OrderDetails[i].Quantity
              }

            this.selectedScanedProducts.push(this.scanedprod);  
           }
              //sumar total
            this.sum = 0;
            for(let i = 0; i<this.selectedScanedProducts.length; i++){
              this.sum = this.sum + this.selectedScanedProducts[i].Price;    
            }
            this.sConfirmar = this.sum.toString();         
         }
         else
           this.isrepeatedpedido = false;
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
    }
 
    //ionicViewDidLoad (se carga solo una vez cuando la vista se carga en memoria)
  ionViewDidLoad()//la primera vez que entra, cargar los productos desde API
  {
    console.log("NUEVO PEDIDO ORDER TO RETREAT - ionViewDidLoad");
    this.barservice.showLoading();
    this.barService.getStoragedata(this.options).then
    (
      opts => {
        console.log(opts.headers.Token + "|| - ||" + opts.headers.UserId);
        this.options.headers.Token = opts.headers.Token;
        this.options.headers.UserId = opts.headers.UserId;

        this.loadProductswqr(); 
        
    },(error) =>
    {
      console.error(error);
      //this.sErrorMessage = error.error.Message;
      let alert = this.alertCtrl.create({
        title: "Nuevo Pedido",
        subTitle: error.error.Message,
        buttons: [{
          text:'Aceptar',
          role: 'cancel',           
        }]
      });
      alert.present(); 
      this.barservice.hideLoading(); 
    }) 
    //this.getStoragedata();
  }

  ionViewWillEnter() //cada vez que entra a la pagina
  {
    //TEST
    /*let alert = this.alertCtrl.create({
      title: "Nuevo Pedido",
      subTitle: "Esta entrando ionViewWillEnter",
      buttons: [{
        text:'Aceptar',
        role: 'cancel',           
      }]
    });
    alert.present(); */ 

    console.log("ionViewWillEnter");
    this.getOrderStoragedata(); 
    this.initializeBackButtonCustomHandler();                
  }

  ionViewWillLeave() //cada vez que sale de la pagina
  {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
    
  }

  //esto es para solucionar cuando esta armando un pedido y vuelve hacia atras, no presentaba el boton
  //de edicion de pedido (lapiz) si no añadir pedido (+)
  ionViewCanLeave(): boolean //solo permitir salir(devolver true)  cuando grabe los datos en storage
  {  
    // here we can either return true or false
    // depending on if we want to leave this view
      console.log("ionViewCanLeave");
      if(!this.bSendedOrder)
      {
        this.storage.set('continueordertype','OrderToRetreat')
        this.storage.set('selectedscanedproducts',this.selectedScanedProducts)
        
        return true;
      }
      else
      {
        return true;
      }           
  }

  getOrderStoragedata()
 {
  this.barservice.showLoading(); 
  this.barService.getOrderStoragedata().then
    (
      (ProductsFromStorage) => {
        if(ProductsFromStorage != null)
        {
           this.selectedScanedProducts = ProductsFromStorage;
            //sumar total
           this.sum = 0;
           for(let i = 0; i<this.selectedScanedProducts.length; i++){
            this.sum = this.sum + this.selectedScanedProducts[i].Price;    
           }
           this.sConfirmar = this.sum.toString();

            //this.loadProductswqr(); //los productos se cargan sin mesa   
        }
        else
        {
             if(this.isrepeatedpedido == true) 
              { this.verpedido = true; } //si es repetir, mostrar el pedido antes que listado productos
             else
               { this.verpedido = false; }//pasar al listado de productos para seleccionar          
        } 
        this.barservice.hideLoading();           
      },
      (error) =>
      {
        console.error(error);
        //this.sErrorMessage = error.error.Message;
        let alert = this.alertCtrl.create({
          title: "Nuevo Pedido",
          subTitle: error.error.Message,
          buttons: [{
            text:'Aceptar',
            role: 'cancel',           
          }]
        });
        alert.present();  
        this.barservice.hideLoading(); 
      }
    )  
 }

  /*getStoragedata()//se ejecuta solo en primer carga
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
        this.userid = values[2];

        //en caso de estar en lab, cargar productos
        if(this.platform.is('core') || this.platform.is('mobileweb')) {
         this.loadProductswqr(); 
        }
        else
        {
          this.scanbar();
        }
        
      }    
   })
 }*/

 //cargar los productos del bar
 loadProductswqr()
 {
  //this.barservice.showLoading();
   this.productswithqty = []; //reset
  console.log("LOAD PRODUCTS WQR"); 
   this.barService.getProductswqr(this.options).then
   (
     (res) => 
     { 
      this.barservice.hideLoading();
      this.products = JSON.parse(res['Data'].toString());
       console.log("PRODUCTOS:"); 
       console.log(this.products);
       this.thisbar = true;
       this.sTitle = "";
        //this.loaded = true;
       this.nummesa = 0;

       for(let i = 0; i<this.products.length; i++){
        this.prod={
          Id:this.products[i].Id,
          Name:this.products[i].Name,
          Description:this.products[i].Description,
          Price:this.products[i].Price,
          Qty:0
          }
       
        this.productswithqty.push(this.prod);       
       }
     },
     (error) =>
     {
       console.error(error.error.Message);
       let alert = this.alertCtrl.create({
        title:"Nuevo Pedido",
        subTitle: error.error.Message,
        buttons: [{
          text:'Aceptar',
          handler: () => {
            console.log('Aceptar clicked');
            this.bSendedOrder = true;           //reset
            this.selectedScanedProducts = [];  //reset
            this.navCtrl.push(PedidosPage);
          }
        }]
      });
      alert.present();
      this.barservice.hideLoading();
     }
   )  
 }


  initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(function(event){
       // alert('Prevent Back Button Page Change');
       console.log('Prevent Back Button Page Change');
    }, 101); // Priority 101 will override back button handling (we set in app.component.ts) as it is bigger then priority 100 configured in app.component.ts file */
} 
 
/*NO SE SCANEA NADA*/

delete(rowIndex){
    //let index = this.selectedScanedProducts[rowIndex];
    let alert = this.alertCtrl.create({
      title: 'Confirmar eliminacion',
      message: '¿Quiere eliminar el producto?',
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
            if(rowIndex > -1){
              this.selectedScanedProducts.splice(rowIndex, 1);
              //sumar total
              this.sum = 0;
              for(let i = 0; i<this.selectedScanedProducts.length; i++){
                 this.sum = this.sum + this.selectedScanedProducts[i].Price; 
               }
               this.sConfirmar = this.sum.toString();
            }
          }
        }
      ]
    });
    alert.present();
  
}
//añadir una unidad mas al pedido
addunit(rowIndex)
{
  this.selectedScanedProducts[rowIndex].Qty += 1;
  this.selectedScanedProducts[rowIndex].Price = this.selectedScanedProducts[rowIndex].UnitPrice *
  this.selectedScanedProducts[rowIndex].Qty;

   //sumar total
   this.sum = 0;
   for(let i = 0; i<this.selectedScanedProducts.length; i++){
     this.sum = this.sum + (this.selectedScanedProducts[i].UnitPrice * this.selectedScanedProducts[i].Qty);    
   }
   this.sConfirmar = this.sum.toString();
}
//quitar una unidad al pedido
remunit(rowIndex)
{
   if(this.selectedScanedProducts[rowIndex].Qty != 1)//
   {
      this.selectedScanedProducts[rowIndex].Qty -= 1;
      this.selectedScanedProducts[rowIndex].Price = this.selectedScanedProducts[rowIndex].UnitPrice *
      this.selectedScanedProducts[rowIndex].Qty;

      //sumar total
      this.sum = 0;
      for(let i = 0; i<this.selectedScanedProducts.length; i++){
        this.sum = this.sum + (this.selectedScanedProducts[i].UnitPrice * this.selectedScanedProducts[i].Qty);    
      }
      this.sConfirmar = this.sum.toString();
  }
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
selectANumber(rowIndex) {
this.selector.show({
  title: "Cantidad",
  items: [
    this.jsonData.numbers
  ],
  positiveButtonText: "Aceptar",
  negativeButtonText: "Cancelar",
  theme: "dark",
  defaultItems: [
       {index:0, value: this.selectedScanedProducts[rowIndex].Qty},      
     ]
}).then(
  result => 
  {
     if(rowIndex > -1){
       if(this.selectedScanedProducts[rowIndex].Qty < 51)
       {
        var unitprice = parseFloat((this.selectedScanedProducts[rowIndex].Price /this.selectedScanedProducts[rowIndex].Qty).toString());
        this.selectedScanedProducts[rowIndex].Qty = parseInt(result[0].description);
        this.selectedScanedProducts[rowIndex].Price = unitprice * this.selectedScanedProducts[rowIndex].Qty;
       
        //sumar total
        this.sum = 0;
        for(let i = 0; i<this.selectedScanedProducts.length; i++){
           this.sum = this.sum + this.selectedScanedProducts[i].Price; 
         }
         this.sConfirmar = this.sum.toString();
       }
      console.log(result[0].description + ' at index: ' + result[0].index);
     }
  },
  err => console.log('Error: ', err)
  );

}

orderData = 
{ 
 "UserId":"0", 
 "StatusValue":1, 
 "OrderDetails":[], 
 "Total":0,
 "BarId":1,  
 "OrderDate":"",
 "OrderTypeId":"2"     //OrderTypeId = 1 es En Bar OrderTypeId = 2 es para retirar OrderTypeId = 3 es a domicilio
}

orderitemdata =
{
  "ProductId": 3,
  "Quantity": 1,
  "Price": 124.0
}

btnaddproductwqr()
{ 
  this.verpedido = false; //listado de productos
  for(let i = 0; i<this.productswithqty.length; i++){ //reset
    
    this.productswithqty[i].Qty = 0;
  }  
}

sendpedido()//boton confirmar
{
  this.barservice.showLoading();
  this.orderData.UserId = this.options.headers.UserId;
  this.orderData.Total = this.sum;
  //this.orderData.BarTableQrcode = this.options.headers.BarTableQrcode;

  let alert = this.alertCtrl.create({
    title: 'Nuevo Pedido',
    message: '¿Esta seguro de enviar el pedido?',
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

          for(let i = 0; i<this.selectedScanedProducts.length; i++)
          {
            this.orderData.OrderDetails.push(
              {"ProductId":this.selectedScanedProducts[i].Id,
              "Quantity":this.selectedScanedProducts[i].Qty,
              "Price": this.selectedScanedProducts[i].Price
              })
          /*this.orderitemdata.ProductId = this.selectedScanedProducts[i].Id;
            this.orderitemdata.Quantity = this.selectedScanedProducts[i].Qty;
            this.orderitemdata.Price = this.selectedScanedProducts[i].Price;
            this.orderData.OrderDetails.push(this.orderitemdata);*/
          }

          console.log(this.orderData);

          this.barservice.postPedido(this.orderData, this.options).then
            (
              (res) => 
              { 
                this.barservice.hideLoading();
                console.log(res);
                let alert = this.alertCtrl.create({
                  title: "Nuevo Pedido",
                  subTitle: res['Message'],
                  buttons: [{
                    text:'Aceptar',
                    handler: () => {
                      console.log('Aceptar clicked');
                      this.storage.remove('continueordertype');
                      this.storage.remove('selectedscanedproducts').then(values => {
                      //remover objeto en memoria, luego salir
                      this.bSendedOrder = true;           //reset
                      this.selectedScanedProducts = [];  //reset
                      //this.navCtrl.push(PedidosPage);
                      this.navCtrl.setRoot(PedidosPage);
                      });                               
                    }
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
                  title: "Nuevo Pedido",
                  subTitle: error.error.Message,
                  buttons: [{
                    text:'Aceptar',
                    role: 'cancel',           
                  }]
                });
                alert.present();  
              }
            )
            
          }//end accept button handler
        }//end accept button
      ]//end buttons
    });
    alert.present();
}

cancelpedido()
{
  let alert = this.alertCtrl.create({
    title: 'Confirmar eliminacion',
    message: '¿Quiere cancelar el pedido?',
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
          this.storage.remove('continueordertype');
          this.storage.remove('selectedscanedproducts').then(values => {
            //remover objeto en memoria, luego salir
            this.bSendedOrder = true;           //reset
            this.selectedScanedProducts = [];  //reset
            //this.navCtrl.push(PedidosPage);
            this.navCtrl.setRoot(PedidosPage);
           });   
        }
      }
    ]
  });
  alert.present();
}

volver()
{
  this.verpedido = true;
}

//add producto desde listado de productos
anadirprod(rowIndex)
{
  this.selectedProduct = {};
  this.selectedProduct = this.products[rowIndex];
  
    if(this.selectedProduct !== undefined) 
    {
      this.productswithqty[rowIndex].Qty += 1;
      //controlar si es repetido
      this.repeated = this.selectedScanedProducts.map(function(e) { return e.Id; }).indexOf(this.selectedProduct.Id);

      if(this.repeated != -1)//lo encuentra, debe añadir uno mas al prod ya existente
      {
        this.productFound = true;
        this.selectedScanedProducts[this.repeated].Qty += 1;
        this.selectedScanedProducts[this.repeated].Price = this.selectedScanedProducts[this.repeated].UnitPrice *
        this.selectedScanedProducts[this.repeated].Qty;
      }
      else
      {
        this.productFound = true;
        this.scanedprod={
          Id:this.selectedProduct.Id,
          ImageUrl: this.selectedProduct.ImageUrl,
          Name: this.selectedProduct.Name,
          Description: this.selectedProduct.Description,
          Price: this.selectedProduct.Price,
          UnitPrice: this.selectedProduct.Price,
          Qty: 1
          }

        this.selectedScanedProducts.push(this.scanedprod);
      }

      //sumar total
      this.sum = 0;
      for(let i = 0; i<this.selectedScanedProducts.length; i++){
        this.sum = this.sum + (this.selectedScanedProducts[i].UnitPrice * this.selectedScanedProducts[i].Qty);    
      }
      this.sConfirmar = this.sum.toString();
    }
}
//quitar producto desde listado de productos
quitarprod(rowIndex)
{
  this.selectedProduct = {};
  this.selectedProduct = this.products[rowIndex];
  
    if(this.selectedProduct !== undefined) 
    {
      if(this.productswithqty[rowIndex].Qty != 0)//productswithqty es listado de productos
        this.productswithqty[rowIndex].Qty -= 1;
      
      //controlar si es repetido
      this.repeated = this.selectedScanedProducts.map(function(e) { return e.Id; }).indexOf(this.selectedProduct.Id);

      if(this.repeated != -1)//lo encuentra, debe quitar uno mas al prod ya existente
      {
        if(this.selectedScanedProducts[this.repeated].Qty > 0)
        {
          this.productFound = true;
         this.selectedScanedProducts[this.repeated].Qty -= 1;
         this.selectedScanedProducts[this.repeated].Price = this.selectedScanedProducts[this.repeated].UnitPrice *
          this.selectedScanedProducts[this.repeated].Qty;

          if(this.selectedScanedProducts[this.repeated].Qty == 0)
              this.selectedScanedProducts.splice(this.repeated, 1); 
        }
        else  if(this.selectedScanedProducts[this.repeated].Qty == 0)//si la cantidad es 0
        {
          this.selectedScanedProducts.splice(this.repeated, 1); 
        } 
      }
      else
      {
        this.productFound = true;       
      }

      //sumar total
      this.sum = 0;
      for(let i = 0; i<this.selectedScanedProducts.length; i++){
        this.sum = this.sum + (this.selectedScanedProducts[i].UnitPrice * this.selectedScanedProducts[i].Qty);    
      }
      this.sConfirmar = this.sum.toString();
    }
}

onModelChange(rowIndex)
{
  //alert("change " + rowIndex);
 
    if(this.selectedScanedProducts[rowIndex].Qty < 51)
    {
     console.log(rowIndex);
     console.log("qty " + this.selectedScanedProducts[rowIndex].Qty)
     //var unitprice = parseFloat((this.selectedScanedProducts[rowIndex].Price /
     //                            this.selectedScanedProducts[rowIndex].Qty).toString());
     console.log("unitprice " + this.selectedScanedProducts[rowIndex].UnitPrice);
     //this.selectedScanedProducts[rowIndex].Qty = parseInt(this.selectedScanedProducts[rowIndex].Qty);
     this.selectedScanedProducts[rowIndex].Price = this.selectedScanedProducts[rowIndex].UnitPrice * 
     this.selectedScanedProducts[rowIndex].Qty;
    
     //sumar total
     this.sum = 0;
     for(let i = 0; i<this.selectedScanedProducts.length; i++){
        this.sum = this.sum + this.selectedScanedProducts[i].Price; 
      }
      this.sConfirmar = this.sum.toString();
    }
  

}


}//end class
