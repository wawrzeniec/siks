import { Injectable } from '@angular/core';
import { userDataContainer, serverPacket } from '@app/modules/data/data.module'
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string;
  private serverIP:string; 

  constructor(private http: HttpClient) { 
    this.serverIP = window.location.hostname;
    let schema = ServerConfig.https? 'https://' : 'http://';
    this.baseUrl = schema + this.serverIP + ':' + ServerConfig.port + '/users/';
    console.log(this.baseUrl);
  }

  addUser(userData: userDataContainer): Observable<serverPacket> {
    // Add user: returns the http response code
    // 200 => OK
    // 503 => SQLITE Error
    // 409 => User already exists
    console.log('UserService: Add User');
    console.log(userData);

    const url: string = this.baseUrl; 
    console.log(url);
    return this.http.post(url, userData) as Observable<serverPacket>;
  }

  checkUserExists(userData: userDataContainer): Observable<serverPacket> {
    // Check if user exists: returns the http response code
    // 200 => User exists
    // 503 => SQLITE Error
    // 404 => Username is available
    console.log('UserService: check user');
    console.log(userData);

    const url: string = this.baseUrl + userData.userName; 
    console.log(url);
    return this.http.head(url) as Observable<serverPacket>;
  }

  deleteUser() {

  }

  updateUser() {

  }

}
