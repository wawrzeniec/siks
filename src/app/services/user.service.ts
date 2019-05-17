import { Injectable } from '@angular/core';
import { userDataContainer, serverPacket } from '@server/assets/assets'
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { ServerService } from '@app/services/server.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string;

  constructor(private server: ServerService) { 
    this.baseUrl = '/users/';
    console.log(this.baseUrl);
  }

  addUser(userData: userDataContainer): Observable<serverPacket> {
    // Add user: returns the http response code
    // 200 => OK
    // 503 => SQLITE Error
    // 409 => User already exists
    const url: string = this.baseUrl; 
    return this.server.post(url, userData, { withCredentials: true });
  }

  checkUserExists(userData: userDataContainer): Observable<serverPacket> {
    // Check if user exists: returns the http response code
    // 200 => User exists
    // 503 => SQLITE Error
    // 404 => Username is available
    const url: string = this.baseUrl + userData.userName; 
    return this.server.head(url, { withCredentials: true });
  }

  deleteUser() {

  }

  updateUser() {

  }

}
