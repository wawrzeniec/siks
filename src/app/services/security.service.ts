import { Injectable } from '@angular/core';
import { SecurityDescriptor } from '@app/modules/data.module'

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
    // Tests a scrape method and returns the quote or an error
    const url: string = this.baseUrl; 
    return this.http.post(url, security) as Observable<serverPacket>;
  }

}
