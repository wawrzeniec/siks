import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams }    from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor() {
    this.location = null;
  }

  // possible implementations:
  // 1. an observable that returns the server IP and which we can use to get/put etc.
  // 2. a wrapper that 
  //  - retrieves the server address if it is null
  //  - attempts to perform the http request 
  //  - on failure reconnects to the server
  //  - can also use wifi-info to fallback to the local address if we are on swisscheese 

  get() {
    // Gets an url - same parameters as http.get
    // We can implement retries and fallback behavior on error
  }
  
  put() {
    // Puts an url
  }
  
  checkWifi() {
    // Uses cordova plugin to retrieve wifi info. 
    // Returns true if we are on swisscheese and false otherwise.
  }
  
  findServer() {
    // This finds the address of the server
    // On the server side the php should decode the json using
    // $_POST = json_decode(file_get_contents(‘php://input’), true);

    const url: string = 'http://siks.badel.org/getServerAddress.php';
    let params = new HttpParams();
    params.append('username', 'siks');
    params.append('password', 'WhereIsTheSiksServer');

    this.http.get(url, {params: params}).subscribe( response => {
       console.log('Obtained server IP: ' + response.ip);
       this.location = response.data;
    }, err => {
        console.log('Error getting the server address!!');
    });
  }

}
