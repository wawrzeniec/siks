import { Injectable } from '@angular/core';
import { Observable, EMPTY, of } from 'rxjs';
import { ServerConfig } from '@server/server-config-ng';
import { CordovaService } from '@app/services/cordova.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LocationService {
public getServer: Observable<string>;
public location: string = ServerConfig.domain;

  constructor(public cordova: CordovaService) {
    this.init();
  }

  init() {
    console.log('Initializing locationService...');    
    this.getServer = this.cordova.getWifiInfo.pipe(
      map(res => this.processWifiInfo(res))
    );
  }
  
  getLocation(): string {
    return this.location;  
  }

  processWifiInfo(info) {
    // This finds the address of the server    
    console.log('LocationService: processing wifi info');
    if (info === 'Browser')
    {
      console.log('LocationService: running in browser');
      this.location = 'https://' + window.location.hostname + ':' + ServerConfig.port;
      return 'browser'   
    }
    else
    {  
      if (info.connection.bssid === ServerConfig.routerbssid)
      {
        console.log('LocationService: connected to Swisscheese.')
        this.location = 'https://' + ServerConfig.ip + ':' + ServerConfig.port;
      }
      else 
      {
        console.log('LocationService: using domain name.')
        this.location = 'https://' + ServerConfig.domain + ':' + ServerConfig.port;
      }
      return 'updateServer'
    }
  }
}
