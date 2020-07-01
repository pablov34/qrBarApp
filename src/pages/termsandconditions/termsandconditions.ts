import { Component } from '@angular/core';
import { NavController, ItemGroup } from 'ionic-angular';
import { App } from 'ionic-angular';
import { RegistroPage } from '../registro/registro';
import { DataServiceProvider } from '../../providers/data-service/data-service';

@Component({
    selector: 'page-termsandconditions',
    templateUrl: 'termsandconditions.html'
  })

  export class TermsAndConditionsPage {
    termsandconditions: string;

    constructor(public navCtrl: NavController, public dataservice: DataServiceProvider) {
    }
    
    ionViewWillEnter() //cada vez que entra a la pagina
    {
      console.log("TERMS AND CONDITIONS - ionViewWillEnter");
      this.getconfigdata();
    }

    getconfigdata()
    {
      console.log("config data:");
      
      this.dataservice.getConfigFile().subscribe
      (
        data => { 
          console.log(data);
          this.termsandconditions = data.TermsAndConditions;
        },
        err => {
          console.log(err);      
        },
      );
    }

    goToInit() {
      //setear el root page a initpage para no tener mas TABS de navegacion
      this.navCtrl.setRoot(RegistroPage);
     }
  }