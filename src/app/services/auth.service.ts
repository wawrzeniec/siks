import { Injectable } from '@angular/core';
import { loginDataContainer, serverPacket } from '@server/assets/assets'
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { ServerService } from '@app/services/server.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string;
  
  constructor(private server: ServerService) { 
    this.baseUrl = '/login';    
  }

  postLogin(loginData: loginDataContainer): Observable<serverPacket> {
    // logs in to the app: returns the http response code
    // 200 => OK
    // 503 => SQLITE Error
    // 401 => Authentication failed
    const url: string = this.baseUrl; 
    return this.server.post(url, loginData, { withCredentials: true });
  }

  logout() {
    // Logs out of the app
    const url: string = this.baseUrl + '/signout'; 
    return this.server.post(url, {}, { withCredentials: true });
  }

}
