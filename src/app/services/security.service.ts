import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { serverPacket, securityDescriptor } from '@server/assets/assets'

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private baseUrl: string;
  private serverIP:string; 

  constructor(private http: HttpClient) { 
    this.serverIP = window.location.hostname;
    let schema = ServerConfig.https? 'https://' : 'http://';
    this.baseUrl = schema + this.serverIP + ':' + ServerConfig.port + '/security';
  }

  addSecurity(security: securityDescriptor): Observable<serverPacket> {
    // Adds a security to the list of securities
    const url: string = this.baseUrl; 
    return this.http.post(url, security, { withCredentials: true }) as Observable<serverPacket>;
  }
}
