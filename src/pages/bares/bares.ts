import { Component, AnimationStyles } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarService } from '../../providers/bar-service/bar-service';


@Component({
  selector: 'page-bares',
  templateUrl: 'bares.html'
})

export class BaresPage {

  gridData = [{ image: "/assets/imgs/bar1.jpg", nombre:"Bar1", url:"http://www.google.com", map:"https://goo.gl/maps/ghZDh5YoezD2" },
               { image: "/assets/imgs/bar2.jpg", nombre:"Bar2", url:"http://www.google.com", map:"https://goo.gl/maps/ghZDh5YoezD2" },
               { image: "/assets/imgs/bar3.jpg", nombre:"Bar3", url:"http://www.google.com", map:"https://goo.gl/maps/ghZDh5YoezD2" }]
 
  gridDataFromAPI: any = [];;

  constructor(public navCtrl: NavController, public barservice: BarService) {
    // this.films = this.httpClient.get('http://www.techtonicit.tech/qrBarApi/api/bar');
    // this.films
   //  .subscribe(data => {
   //   console.log('my data: ', data);
   // })
  }

  //ionViewDidLoad(){
   // this.gridDataFromAPI = this.barservice.getBars();
   // console.log(this.gridDataFromAPI);
    /*this.barservice.getBars().then
    (
      (res) => 
      { 
       // this.gridDataFromAPI = res;
        //console.log(res);                 
        //console.log(JSON.parse(JSON.stringify(res))); //to string
        this.gridDataFromAPI = JSON.parse(res.toString());
        console.log(this.gridDataFromAPI);
      },
      (error) =>
      {
        console.error(error);
      }
    )
  }*/
  
}//end class
