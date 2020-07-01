//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { Events } from 'ionic-angular';
/*
  Generated class for the BarServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BarService {
  loading: any;
  constructor(private http: HttpClient, public storage: Storage, public loadingCtrl: LoadingController,
    public dataservice: DataServiceProvider,public events: Events) {
    console.log('Hello BarServiceProvider Provider'); 
    this.getconfigdata()   
  }

timeoutval:number = 30000;
interval: any;
hideloadingtimeout:number = 30000;
hideloadingtimeoutaltas:number = 50000;
timeout:any;
todayDate: Date = new Date();
BARID: string;

  showLoading() 
  {
    
       this.startTimer();

    this.loading = this.loadingCtrl.create({
      spinner: "crescent",
      showBackdrop: true,
      cssClass: "my-loading-class"
    });
    this.loading.present();
  } 

 hideLoading(){
  this.loading.dismissAll();
  clearTimeout(this.timeout);  
 }
 
 startTimer()
   {
     this.timeout = setTimeout(function(){
      // alert("hideloading ejecutar");  
       this.hideLoading(); //ejecutar el hideloading asi no jode mas  
     }.bind(this),this.hideloadingtimeout)
   }

   //timeout para altas
 showLoadingAltas()
 {
    this.loading = this.loadingCtrl.create({
      spinner: "crescent",
      showBackdrop: true,
      cssClass: "my-loading-class"
    });
    this.loading.present();
 }
 
hideLoadingAltas()
{
  this.loading.dismissAll();
  clearTimeout(this.timeout);  
}

startTimerAltas()
{
  this.timeout = setTimeout(function(){
    // alert("hideloading ejecutar");  
    this.hideLoadingAltas(); //ejecutar el hideloading asi no jode mas  
    console.log('HideLoadingAltas')
    this.events.publish('loadingaltas:hide'); 
  }.bind(this),this.hideloadingtimeoutaltas)
}

  apiUrl; //http://localhost:28250/api/
  //apiUrl = 'http://localhost:28250/api/'
  apiUrl3;
  apiUrl4; 
  apiUrl5;        
  apiUrl6;
  apiUrl7;
  apiUrl8;  //http://www.techtonicit.tech/qrBarApi/api/
  apiUrl9;
  apiUrl10;
  apiUrl11;
  apiUrl12;
  apiUrl13;
  apiUrl14;
  apiUrl15;

  panelobject;

 getconfigdata()
  {
    console.log("config data:");
    
    this.dataservice.getConfigFile().subscribe
    (
      data => { 
        console.log(data);
        console.log(data.ApiUrlPath);
        this.setconfigdata(data);  
      },
      err => {
        console.log(err);      
      },
      
    );
  }

 setconfigdata(data)
  {  
      console.log("BAR SERVICE config data:");
    
      console.log(data);
      this.apiUrl = data.ApiUrlPath;
      console.log(this.apiUrl);
      this.apiUrl3 = this.apiUrl + 'bar';
      this.apiUrl4 = this.apiUrl + 'publication'; 
      this.apiUrl5 = this.apiUrl + 'myreserve';    
      this.apiUrl6 = this.apiUrl + 'myorder';
      this.apiUrl7 = this.apiUrl + 'user';
      this.apiUrl8 = this.apiUrl + 'getproducts';  //http://www.techtonicit.tech/qrBarApi/api/
      this.apiUrl9 = this.apiUrl + 'login';
      this.apiUrl10 = this.apiUrl + 'forgotpassword';
      this.apiUrl11 = this.apiUrl + 'order';
      this.apiUrl12 = this.apiUrl + 'reserve';
      this.apiUrl13 = this.apiUrl + 'fcmtoken';
      this.apiUrl14 = this.apiUrl + 'getproductswqr';
      this.apiUrl15 = this.apiUrl + 'ordercall';
      this.timeoutval = parseInt(data.Timeoutval);
      this.hideloadingtimeout = parseInt(data.Hideloadingtimeout);
      this.hideloadingtimeoutaltas = parseInt(data.Hideloadingtimeoutaltas) 
      this.BARID = data.BarId;
            
 }

   getBars()
   {  
     /* return this.http
      .get(this.apiUrl3,this.options)
      .toPromise();   */ 
  }

 getImages(options)
 { 
  console.log("BAR SERVICE getImages");
  console.log(options);
  return this.http.get(this.apiUrl4,options).timeout(this.timeoutval)
  .toPromise();        
 }

 putfcmtoken(options)
  {
    return this.http.put(this.apiUrl13, null, options).toPromise();
  }

  getReserves(options)
  {  
      return this.http
      .get(this.apiUrl5,options).timeout(this.timeoutval)
      .toPromise();    
    
  }

  getPedidos(options)
  { 
       
    return this.http
    .get(this.apiUrl6,options).timeout(this.timeoutval)
    .toPromise();
    
  }

  postPedido(pedidoData, options)
  {
    
    options.barId = this.BARID; 
    return this.http.post(this.apiUrl11,JSON.stringify(pedidoData),options)
    .toPromise();
  }

  getUser(options)
  {
    
    return this.http
    .get(this.apiUrl7 + "/" + options.headers.UserId ,options)
    .toPromise();
  }

  putUser(userData, options)
  { 
    
   return this.http.put(this.apiUrl7 + "/" + options.headers.UserId, JSON.stringify(userData),options).toPromise();
  }


  getProducts(options){
    
    return this.http
    .get(this.apiUrl8,options)
    .toPromise();
  }

  getProductswqr(options){
    
    return this.http
    .get(this.apiUrl14,options)
    .toPromise();
  }

  postReserve(reservaData, options)
  { 
    
    options.barId = this.BARID;
    return this.http.post(this.apiUrl12,JSON.stringify(reservaData),options).toPromise();
  }
  
  putReserve(id, reservaData, options)
  {
    
    options.barId = this.BARID; 
   return this.http.put(this.apiUrl12 + "/" + id,JSON.stringify(reservaData),options).toPromise();
  }

  deleteReserve(id, options)
  {  
    
    return this.http.delete(this.apiUrl12 + "/" + id, options).toPromise();
  }

  getLogin(email, password)
  {
    
    let options = {
      headers: {
        'Password': password       
      }
    };
    var parameters = "?username=" + email + "&barId=" + this.BARID;
    console.log(this.apiUrl9 + parameters);

    return this.http.get(this.apiUrl9 + parameters, options).toPromise();
  }

  postRegistracion(userData, options)
  {
    
    options.barId = this.BARID;
    return this.http.post(this.apiUrl7,JSON.stringify(userData),options).toPromise();
  }

  getContraseña(options)
  {
    //var parameters = "?username=" + email + "&barId=1";
    //console.log(this.apiUrl10 + parameters);
    
    options.barId = this.BARID; 
    return this.http
    .get(this.apiUrl10, options)
    .toPromise();
  }

  putOrderCall(options)
  {    
   // options.barId = this.BARID; 
   return this.http.put(this.apiUrl15,null,options).toPromise();
  }

  //NUEVO PEDIDO FUNCTIONS 
  //concentrar la mayoría de funciones repetitivas en un solo archivo general
  getStoragedata(options):Promise<any>
  {
    console.log('NUEVO PEDIDO - BAR SERV - GET STORAGE DATA') 
    return Promise.all([this.storage.get("email"), this.storage.get("token"), this.storage.get('userid')]).
    then(values => {
      console.log(" Your email is", values[0]);
      console.log(" Your token is", values[1]);
      console.log(" Your userid is", values[2]);
      if(values[2] != undefined)
      {
     	  options.headers.Token = values[1];
        options.headers.UserId = values[2].toString();
        //userid = values[2];

        return(options);
      }    
   })
  }

  selectedScanedProductsFromStorage: any[];
  getOrderStoragedata():Promise<any>
 {
  console.log('NUEVO PEDIDO - BAR SERV - GET ORDER STORAGE DATA')
  return Promise.all([this.storage.get("selectedscanedproducts")]).
  then(values => {
    console.log("nuevopedido selectedscanedproducts ", values[0]);
    this.selectedScanedProductsFromStorage = values[0];
    if(this.selectedScanedProductsFromStorage != null && this.selectedScanedProductsFromStorage.length > 0)
    {
      console.log("(getOrderStoragedata) hay datos guardados desde storage")
      return this.selectedScanedProductsFromStorage;
    }
    else
    {
      console.log("(getOrderStoragedata) NO hay datos guardados desde storage");
      
      //if(!this.isrepeatedpedido)//si es repetir pedido no necesita scann bar
       // this.scanbar(); 
       return null;
    }
 })
 }
 
}
