import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import {  IonicPage, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-modalprodqty',
  templateUrl: 'modalprodqty.html',
})
export class ModalprodqtyPage {
  items = [1,2,3,4,5,6,7,8,9,10]
  detailsummaryitems: any = [];
  total: number;
  delaytimerange: string;
  orderdetails:any = [];
  verEntrega: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

 //ionicViewDidLoad (se carga solo una vez cuando la vista se carga en memoria)
  ionViewWillLoad() {
    const data = this.navParams.get('data');
 
  }

  ionViewWillEnter() //cada vez que entra a la pagina
  {
    const data = this.navParams.get('data');
    console.log(data);
    this.detailsummaryitems = data.DetailSummary.split('.');
    this.total = data.Total;
    this.delaytimerange = data.DelayTimeRange;
    this.orderdetails = data.OrderDetails;
    if(data.Status != "Confirmado")
      this.verEntrega = false;
    else
      this.verEntrega = true;
  }

  closeModal() {
    /*const data = {
      name: 'John Doe',
      occupation: 'Milkman'
    };*/
    this.viewCtrl.dismiss();
  }

  close(item){
    console.log(item);
    const data = {
      qty: item
    };
    this.viewCtrl.dismiss(data);    
  }

  

}
