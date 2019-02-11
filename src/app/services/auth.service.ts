import { Injectable } from '@angular/core';
import { loginDataContainer, serverPacket } from '@app/modules/data/data.module'
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string;
  private serverIP:string;   

  constructor(private http: HttpClient) { 
    this.serverIP = window.location.hostname;
    let schema = ServerConfig.https? 'https://' : 'http://';
    this.baseUrl = schema + this.serverIP + ':' + ServerConfig.port + '/login/';    
  }

  postLogin(loginData: loginDataContainer): Observable<serverPacket> {
    // Add user: returns the http response code
    // 200 => OK
    // 503 => SQLITE Error
    // 401 => Authentication failed
    const url: string = this.baseUrl; 
    return this.http.post(url, loginData, { withCredentials: true }) as Observable<serverPacket>;
  }

}
