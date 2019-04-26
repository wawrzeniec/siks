import { Injectable } from '@angular/core';
import { loginDataContainer, serverPacket } from '@server/assets/assets'
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
    this.serverIP = ServerConfig.ip;
    let schema = ServerConfig.https? 'https://' : 'http://';
    this.baseUrl = schema + this.serverIP + ':' + ServerConfig.port + '/login';    
  }

  postLogin(loginData: loginDataContainer): Observable<serverPacket> {
    // logs in to the app: returns the http response code
    // 200 => OK
    // 503 => SQLITE Error
    // 401 => Authentication failed
    const url: string = this.baseUrl; 
    return this.http.post(url, loginData, { withCredentials: true }) as Observable<serverPacket>;
  }

  logout() {
    // Logs out of the app
    const url: string = this.baseUrl + '/signout'; 
    return this.http.post(url, {}, { withCredentials: true }) as Observable<serverPacket>;
  }

}
