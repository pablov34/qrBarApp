import { Component } from '@angular/core';
import { NavController, Platform  } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { LoginPage } from '../login/login';
import { RegistroPage } from '../registro/registro';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { FCM } from '@ionic-native/fcm';
import { BarService } from '../../providers/bar-service/bar-service';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { LocalNotifications } from '@ionic-native/local-notifications'
import { Network } from '@ionic-native/network';
import { AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'init-home',
  templateUrl: 'init.html'
})

export class InitPage {
tabBarElement;
loginDate: Date;
todayDate: Date = new Date();
userFCMToken: string;
token: string;
userid: string;
notiftype: string;
disconnectSubscription: any;
connected: boolean = true;
logued: boolean;

options = {
  headers: {
    'Content-Type': 'application/json',
    'Token':'',
    'UserId':'',
    'FcmToken':''
  }
};

  constructor(public navCtrl: NavController, public storage: Storage, public fcm: FCM,
    public barservice: BarService, private localNotifications: LocalNotifications,
    public network: Network, private alertCtrl: AlertController,public plt: Platform, private splashScreen: SplashScreen,
    public dataservice: DataServiceProvider) 
  {
    this.tabBarElement = document.querySelector('#navtab');
    
  } 
  
  //ionicViewDidLoad (se carga solo una vez cuando la vista se carga en memoria)
  ionViewDidLoad(){      
     // this.verificarconexion()
     this.getconfigdata();
     //this.getStoragedata();  
  }

  //ionViewWillUnload (se ejecuta cuando la pagina se borra definitivamente)
  ionViewWillUnload()
  {
   // stop disconnect watch
   //  this.disconnectSubscription.unsubscribe();
  }

  ionViewWillEnter()
  {
      //this.tabBarElement.style.display = 'none';
      console.log('ionViewWillEnter');
      //this.disconnectSubscription.unsubscribe();
      if(this.isConnected())
         this.connected = true;
      else
         this.connected = false;
         
      this.verificarconexion();
      this.getconfigdata(); //this.getStoragedata();
     /*let elem = <HTMLElement>document.querySelector("#navtab");
      if (elem != null) {
        elem.style.display = 'none';
      }*/
  }

  ionViewWillLeave()
  {
      //this.tabBarElement.style.display = 'block';
      console.log('ionViewWillLeave');
   
  }

  //comprobacion inicial de conectado en ionViewWillEnter
  isConnected(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
    //return true; //test in lab
  }

  getconfigdata()
  {
    console.log("INIT config data:");
    
    this.dataservice.getConfigFile().subscribe
    (
      data => { 
        console.log(data);
        console.log(data.ApiUrlPath);
        this.getStoragedata();  
      },
      err => {
        console.log(err);      
      },
      
    );
  }

  getStoragedata()
  { 
      return Promise.all([this.storage.get("loginenddate"),  this.storage.get('userid'),
      this.storage.get("userFCMToken"), this.storage.get("token")]).
      then(values => {
        if(values[0] != undefined && values[1] != undefined)
        {
          this.loginDate = values[0];
          console.log("INIT logindate+1: " + this.loginDate);
          console.log("INIT today: " + this.todayDate);
          this.userFCMToken = values[2];
          this.token = values[3];
          this.userid = values[1];
          this.options.headers.Token = this.token.toString();
          this.options.headers.UserId = this.userid.toString();

          if(values[2] == null) //no tiene userFCMToken, obtenerlo
          {
                  this.fcm.getToken().then(token => {
                  // Your best bet is to here store the token on the user's profile on the
                  // Firebase database, so that when you want to send notifications to this 
                  // specific user you can do it from Cloud Functions.
                  //alert("getToken from FCM: " + token);  
                  //alert("userFCMToken (in storage): " +  this.userFCMToken);
                  
                    if(this.userFCMToken != token)
                    {
                      this.storage.set('userFCMToken',token);
                     // alert("saved userFCMToken TO storage: " +  token);
                      this.options.headers.FcmToken = token.toString();

                      this.barservice.putfcmtoken(this.options).then
                      (
                        (res) => 
                        {
                          //alert("userFCMToken SAVED TO API ")
                        },
                        (error) =>
                        {
                          
                        }
                      )   
                    }//end if
                })
          }
         

        }//end if 
        this.notification();
     })//end .then

  } //end method

  notification()
  {
    this.islogged();

    this.fcm.onTokenRefresh().subscribe(token=>{
      // alert("onTokenRefresh: " + token);
      });

    this.fcm.onNotification().subscribe( data => {
      //alert(JSON.stringify(data));
      Promise.all([this.storage.get("loginenddate"),  this.storage.get('userid')]).
      then(values => {
        if(values[0] != undefined && values[1] != undefined)
        {
          let loginDate = values[0];
          if(loginDate > this.todayDate)
          {
              console.log("barservice islogged = TRUE");
              this.logued = true;
              
          }
        }
        else
        {
          console.log("barservice islogged = FALSE");
          this.logued =  false;
        }
          if(data.wasTapped)
          {
            //Notification was received on device tray and tapped by the user.
            console.log(JSON.stringify(data));
          
            this.notiftype = data.NotifType;
            if(this.notiftype.toString().includes("Pedido"))
            {
              if(this.logued == true)
              {
                this.navCtrl.setRoot(TabsPage, {tabIndex:1, DisableCloseBarTable:false});
              //alert("Notificacion desde afuera - ir a Pedidos");
              }
              else
              {
                this.navCtrl.setRoot(LoginPage);
              }           
            }
            if(this.notiftype.toString().includes("Reserva"))
            {
              if(this.logued == true)
              {
                this.navCtrl.setRoot(TabsPage, {tabIndex:2});
                //alert("Notificacion desde afuera - ir a Reserva");
              }
              else
              {
                this.navCtrl.setRoot(LoginPage);
              }           
            }
            if(this.notiftype.toString().includes("PublicationUpdated"))
            {
              if(this.logued == true)
              {
                this.navCtrl.setRoot(TabsPage, {tabIndex:0});
                //alert("Notificacion desde afuera - ir a Reserva");
              }
              else
              {
                this.navCtrl.setRoot(LoginPage);
              }           
            }
            if(this.notiftype.toString().includes("MesaLiberada"))
            {
              if(this.logued == true)
              {
                this.storage.set('DisableCloseBarTable','true');
                this.navCtrl.setRoot(TabsPage, {tabIndex:1});
                //alert("Notificacion desde afuera - ir a Reserva");
              }
              else
              {
                this.navCtrl.setRoot(LoginPage);
              }           
            }

          }
          else
          {
            //Notification was received in foreground. Maybe the user needs to be notified.
            console.log(JSON.stringify(data));
            //alert(JSON.stringify(data));
            this.notiftype = data.NotifType;
            if(this.notiftype.toString().includes("Pedido"))
            {
              //this.navCtrl.push('DetailPage', { Notification: data.profileId });
              if(this.logued == true)
              {
                //alert("Notificacion desde dentro - ir a Pedidos" +  data.title + " " + data.body);
                this.localNotifications.schedule({
                  title: data.title,
                  text: data.body,
                  foreground: true
                  });
                
                  if(this.notiftype.toString() != 'PedidoAccepted ')
                      this.navCtrl.setRoot(TabsPage, {tabIndex:1});              
              }
              else
              {
                this.navCtrl.setRoot(LoginPage);
              } 
            }
            if(this.notiftype.toString().includes("Reserva"))
            {
              //this.navCtrl.setRoot('DetailPage', { Notification: data.profileId });
              if(this.logued == true)
              {
                //alert("Notificacion desde dentro - ir a Reserva" + data.title + " " + data.body);
                this.localNotifications.schedule({
                  title: data.title,
                  text: data.body,
                  foreground: true
                  });
                  if(this.notiftype.toString() != 'ReservaPending')
                    this.navCtrl.setRoot(TabsPage, {tabIndex:2});
              }
              else
              {
                this.navCtrl.setRoot(LoginPage);
              } 
            }
            if(this.notiftype.toString().includes("PublicationUpdated"))
            {
              //this.navCtrl.setRoot('DetailPage', { Notification: data.profileId });
              if(this.logued == true)
              {
                //alert("Notificacion desde dentro - ir a Reserva" + data.title + " " + data.body);
                this.localNotifications.schedule({
                  title: data.title,
                  text: data.body,
                  foreground: true
                  });
                  
                  this.navCtrl.setRoot(TabsPage, {tabIndex:0});
              }
              else
              {
                  this.navCtrl.setRoot(LoginPage);
                } 
            }
            if(this.notiftype.toString().includes("MesaLiberada"))
            {
              //this.navCtrl.setRoot('DetailPage', { Notification: data.profileId });
              if(this.logued == true)
              {
                //alert("Notificacion desde dentro - ir a Reserva" + data.title + " " + data.body);
                this.localNotifications.schedule({
                  title: data.title,
                  text: data.body,
                  foreground: true
                  });
                  
                  this.storage.set('DisableCloseBarTable','true');
                  this.navCtrl.setRoot(TabsPage, {tabIndex:1});
              }
              else
              {
                  this.navCtrl.setRoot(LoginPage);
                } 
            }
          }

      })//end .then

       
      },
      (error) =>
      {
        alert("OnNotification error: " + error);
      });

      // Subscribe the devices corresponding to the registration tokens to the
      // topic.
      this.fcm.subscribeToTopic("MansoCabronNews")
      .then(function(response) {
        // See the MessagingTopicManagementResponse reference documentation
        // for the contents of response.
        console.log('Successfully subscribed to topic:', response);
      })
      .catch(function(error) {
        console.log('Error subscribing to topic:', error);
      });
  }

  goToLogin(): void 
  {
    this.islogged()
     if(this.connected == true)
     {
        if(this.logued == true)
        {
          console.log("INIT go to tabs page (is logged)");
          this.navCtrl.push(TabsPage);
        }
        else{
          console.log("INIT go to login page (Not logged)");
          this.navCtrl.push(LoginPage);
        }
    }
    else
     {
      let alert = this.alertCtrl.create({
        title: 'qrBar',
        subTitle: "No cuenta con conexión a internet, reintente más tarde",
        buttons: [{
          text:'Aceptar'        
        }]
      });
      alert.present();
     }
  }

  goToRegistro(): void
  {
     if(this.connected == true)
     {
       this.navCtrl.push(RegistroPage);
     }
     else
     {
      let alert = this.alertCtrl.create({
        title: 'qrBar',
        subTitle: "No cuenta con conexión a internet, reintente más tarde",
        buttons: [{
          text:'Aceptar'        
        }]
      });
      alert.present();
     }
  }

  
  
    verificarconexion()
    {
      if(this.plt.is('core') || this.plt.is('mobileweb')) {
        this.connected = true;
      }

       this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
         if(this.connected == false){
           return;
         }
        this.connected = false;
        //something
        let alert = this.alertCtrl.create({
          title: 'qrBar',
          subTitle: "No cuenta con conexión a internet, reintente más tarde",
          buttons: [{
            text:'Aceptar',
            handler: () => {
              console.log('Aceptar clicked');
              this.navCtrl.setRoot(InitPage);
            }
          }]
        });
        alert.present();
        
      });
  
      this.network.onConnect().subscribe(() => {
        //something 
        this.connected = true;
        this.reload();
      });
    }

   islogged()
  {
      Promise.all([this.storage.get("loginenddate"),  this.storage.get('userid')]).
      then(values => {
        if(values[0] != undefined && values[1] != undefined)
        {
          let loginDate = values[0];
          if(loginDate > this.todayDate)
          {
              console.log("barservice islogged = TRUE");
              this.logued = true;
              
          }
        }
        else
        {
          console.log("barservice islogged = FALSE");
          this.logued =  false;
        }
      })//end .then
     
  }

  reload(){
    this.splashScreen.show();
    window.location.reload();
  }
   
}
