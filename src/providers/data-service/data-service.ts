import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {

  constructor(public http: Http) {
    console.log('Hello DataServiceProvider Provider');
  }

  getConfigFile(){ 
    var response = this.http.get('assets/data/config.json')
    .map((response:Response)=>response.json())

    return response;
  }

  getConfigApi(options)
  { 
    console.log("DATA SERVICE getConfig");
    console.log(options);
    return this.http.get("http://www.techtonicit.tech/qrBarApi/api/configuration", options)
    .toPromise();  
  }




}
