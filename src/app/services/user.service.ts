import { Injectable } from '@angular/core';
import { DataModule, userDataContainer } from '@app/modules/data/data.module'
import { Observable } from 'rxjs';
import { HttpClient }    from '@angular/common/http';
import { ServerConfig} from '@server/server-config-ng';

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

  checkuserExists() {

  }

  addUser(userData: userDataContainer): Observable<Object> {
    // Add user: returns the http response code
    // 200 => OK
    // 503 => SQLITE Error
    // 409 => User already exists
    console.log('UserService: Add User');
    console.log(userData);

    const url: string = this.baseUrl; 
    console.log(url);
    return this.http.post(url, userData);
  }

  deleteUser() {

  }

  updateUser() {

  }

}