import { Component } from '@angular/core';

import { PedidosPage } from '../pedidos/pedidos';
//import { BaresPage } from '../bares/bares';
import { HomePage } from '../home/home';
import { ReservasPage } from '../reservas/reservas';
import { MiCuentaPage } from '../micuenta/micuenta';
import { NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  public tabIndex:Number = 0;

  tab1Root = HomePage;
  //tab2Root = BaresPage;
  tab2Root = PedidosPage;
  tab3Root = ReservasPage;
  tab4Root = MiCuentaPage;

  constructor(public params:NavParams) {
    let tabIndex = this.params.get('tabIndex');
    if(tabIndex){
      this.tabIndex = tabIndex;
    }
  }


}
