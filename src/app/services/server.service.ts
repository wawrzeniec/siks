import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { EventService } from '@app/services/event.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private location: string;

  constructor(
    private http: HttpClient,
    private eventService: EventService) {}

  get(path: string, options?) {
    // Gets an url - same parameters as http.get
    // We can implement retries and fallback behavior on error
    console.log('called server.get with path=' + path + ' / options=' + options);
    return this.fget(0, path, options);
  }
  
  fget(count: number, path: string, options?: any, params?: any) {
    let url = this.location? this.location + path : path;
    console.log('in fget() with url=' + url);
    return this.http.get(url, options).pipe(
      retry(1),                                                     //Retries one time 
      catchError(err => this.handleError(err, this.fget, count, path, options))
    );
  }

  handleError(err, method: Function, count: number, path: string, options?: any, params?: any) {
    // HTTP error handler. 
    // If could not connect to server, try to update the server address and retry
    // If other error, rethrow it
    if (count >= 1) {
      console.log('Max number of attempts to connect to server exceeded. Giving up.')
      return throwError(err); 
    }

    switch(err.status) {
      case 0: 
        // Unknown error => attempt reconnecting to the server and retry
        
        // Getting the ip from HTTP server is doomed to fail.
        // We use dyndns instead with a fixed domain name.
        /*
        this.getServer().subscribe( response => {
          console.log('Obtained server IP: ' + response['data']);
          this.location = response['data'];
          return method(count+1, path, options, params)
       }, err => {
           console.log('Error getting the server address!!');
           return throwError(err); 
       });
       */
        this.location = this.getServer();
        return method(count+1, path, options, params);
        break;
      case 401:
        // Session invalid -> fallback to login
        this.eventService.triggerLogin();
        return throwError(err);
        break;
      case 403:
      case 404:
      case 500:
        // Known errors => this is not a connection error
        return throwError(err); 
        break;
      default:
         console.log('Unimplemented error status found in server.service.handleError()');
         console.log(err)
         return throwError(err); 
    }
  }

  post() {
    // Posts an url
  }
  
  checkWifi() {
    // Uses cordova plugin to retrieve wifi info. 
    // Returns true if we are on swisscheese and false otherwise.
  }
  
  getServer() {
    // This finds the address of the server
    // On the server side the php should decode the json using
    
    // With cordova this should fallback to local address if on wifi

    // This doesn't work due to mixed content policy
    /* 
    const url: string = 'http://siks.badel.org/getServerAddress.php';
    let params = new HttpParams();
    params.append('username', 'siks');
    params.append('password', 'WhereIsTheSiksServer');

    const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    
    return this.http.get(url, {params: params, headers: headers});
    */
    
    return ServerConfig.ip;
  }

}
