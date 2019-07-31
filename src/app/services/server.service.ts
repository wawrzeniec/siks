import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError, retry, switchMap, flatMap, tap, retryWhen, repeatWhen, scan } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { EventService } from '@app/services/event.service';
import { LocationService } from '@app/services/location.service';
import { CordovaService } from '@app/services/cordova.service';
import { serverPacket } from '@server/assets/assets'

declare var cordova; 

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private location: string;  
  public wifi;  

  constructor(public http: HttpClient,
              public eventService: EventService,
              public locationService: LocationService)  {
    this.init();
  }

  init() {
    console.log('Initializing ServerService...');
  }

  setLocation(loc): void {
    this.location = loc;
  }

  getLocation(): string {
    return(this.location);
  }

  get(path: string, options?) {
    // Gets an url - same parameters as http.get
    // We can implement retries and fallback behavior on error
    let url = this.locationService.getLocation() + path;
    let nErrors = 0;
    console.log('called server.get with path=' + path + ' / options=' + options + ' / location=' + this.locationService.getLocation());    
    console.log('url = ' + url);
    return this.http.get(url, options).pipe(   
      catchError(err => this.handleError(err)),      
      retryWhen(err => 
        err.pipe(
          tap((err)=>{
            console.log('retrywhen: error = ');
            console.log(err)
            }),
          map((err) => {
            nErrors += 1;
            if (err !== 'updateServer' || nErrors > 1) {              
              throw(err);
            }
          })
        )
      )      
    ) as Observable<serverPacket>;
  }
  
  post(path: string, params?, options?) {
    // Posts an url
    let url = this.locationService.getLocation() + path;
    let nErrors = 0;
    console.log('called server.post with path=' + path + ' / options=' + options + ' / params=' + params);
    return this.http.post(url, params, options).pipe(   
      catchError(err => this.handleError(err)),      
      retryWhen(err => 
        err.pipe(
          tap((err)=>{
            console.log('retrywhen: error = ');
            console.log(err)
            }),
          map((err) => {
            nErrors += 1;
            if (err !== 'updateServer' || nErrors > 1) {              
              throw(err);
            }
          })
        )
      )      
    ) as Observable<serverPacket>;
  }
  
  head(path: string, options?) {
    // HEAD method
    let url = this.locationService.getLocation() + path;
    let nErrors = 0;
    console.log('called server.head with path=' + path + ' / options=' + options);    
    return this.http.head(url, options).pipe(   
      catchError(err => this.handleError(err)),      
      retryWhen(err => 
        err.pipe(
          tap((err)=>{
            console.log('retrywhen: error = ');
            console.log(err)
            }),
          map((err) => {
            nErrors += 1;
            if (err !== 'updateServer' || nErrors > 1) {              
              throw(err);
            }
          })
        )
      )      
    ) as Observable<serverPacket>;
  }
  

  async handleError(err) {
    // HTTP error handler. 
    // If could not connect to server, try to update the server address and retry
    // If other error, rethrow it  
    console.log('In handleError()');          
    switch(err.status) {
      case 0:
        // Unknown error => attempt reconnecting to the server and retry        
        console.log('handleError: trying to switch server')
        const loc = await this.locationService.getServer.toPromise();
        if (loc == 'updateServer') {
          console.log('handleError: received updateServer');
          throw(new Error('updateServer'));
        } 
        else {
          console.log('handleError: received browser');
          throw (new Error('browser'));
        }
        break;
      case 401:
        // Session invalid -> fallback to login
        console.log('handleError: 401 received; triggering login')
        const result = await this.triggerLogin()
        console.log('Login dialog closed. result=' + result);        
        if (!result) {
          console.log('ServerService: Throwing error 401');
          throw(err);
        }
        break;
      case 403:
      case 404:
      case 500:
        // Known errors => this is not a connection error
        console.log('handleError: HTTP code 403, 404, or 500 received; aborting')
        throw(err); 
        break;
      default:
         console.log('Unimplemented error status found in server.service.handleError()');
         console.log(err)
         throw(err); 
    }
  }  

  async triggerLogin() {
    return this.eventService.triggerLogin();
  }
}
