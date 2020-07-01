import { Component, Input } from '@angular/core';
import { NavController, DateTime } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { InitPage } from '../init/init';
import { PedidosPage } from '../pedidos/pedidos';
import { NuevoPedidoOrderQrPage } from '../nuevopedidoorderqr/nuevopedidoorderqr';
import { NuevoPedidoOrderWQrPage } from '../nuevopedidoorderwqr/nuevopedidoorderwqr';
import { NuevoPedidoOrderToRetreatPage } from '../nuevopedidoordertoretreat/nuevopedidoordertoretreat';
import { ReservasPage } from '../reservas/reservas';
import { RegistroPage } from '../registro/registro';

@Component({
  selector: 'page-header',
  templateUrl: 'header.html',
})
export class HeaderPage {
  public logoImg: string = "assets/imgs/Logo2_qr.png";
  @Input() 
  backButtonId: number = 0;

  constructor(public navCtrl: NavController, private storage: Storage) {
  }

  goToTab(): void {
     // set a key/value
    this.navCtrl.push(TabsPage);
  }

  goToInit(): void {
    //setear el root page a initpage para no tener mas TABS de navegacion
    this.storage.clear();
    this.navCtrl.setRoot(InitPage);
   }

   setGoToPage(): void {
    //setear el root page a initpage para no tener mas TABS de navegacion

    switch(this.backButtonId){
        case 1:{
          this.storage.clear();
          this.navCtrl.setRoot(InitPage);
          break;
        }
        case 2:{
          this.navCtrl.setRoot(PedidosPage);
          break;
        }
        case 3:{
          this.navCtrl.setRoot(ReservasPage);
          break;
        }
        case 4:{
          this.navCtrl.setRoot(RegistroPage);
          break;
        }
        // case 5:{
        //   this.navCtrl.setRoot(PedidosPage);
        //   this.navCtrl.setRoot(NuevoPedidoOrderQrPage,{verpedido:true});
        //   break;
        // }
        // case 6:{
        //   this.navCtrl.setRoot(PedidosPage);
        //   this.navCtrl.setRoot(NuevoPedidoOrderWQrPage,{verpedido:true});
        //   break;
        // }
        // case 7:{
        //   this.navCtrl.setRoot(PedidosPage);
        //   this.navCtrl.setRoot(NuevoPedidoOrderToRetreatPage,{verpedido:true});
        //   break;
        // }
      }
   }
}
