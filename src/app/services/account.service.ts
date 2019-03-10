import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { serverPacket, assetDescriptor } from '@server/assets/assets'

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl: string;
  private pfUrl: string;
  private serverIP:string; 

  constructor(private http: HttpClient) { 
    this.serverIP = window.location.hostname;
    let schema = ServerConfig.https? 'https://' : 'http://';
    this.baseUrl = schema + this.serverIP + ':' + ServerConfig.port + '/accounts';
    this.pfUrl = schema + this.serverIP + ':' + ServerConfig.port + '/portfolios';
  }

  getAccounts(): Observable<serverPacket> {
    // Retrieves the existing accounts for the current user
    const url: string = this.baseUrl; 
    return this.http.get(url, { withCredentials: true }) as Observable<serverPacket>;
  }

  addAccount(accountspec: any): Observable<serverPacket> {
    // Adds a new account for the current user
    const url: string = this.baseUrl; 
    return this.http.post(url, accountspec, { withCredentials: true }) as Observable<serverPacket>;
  }

  getPortfolios(): Observable<serverPacket> {
    // Retrieves the existing portfolios for the current user
    const url: string = this.pfUrl; 
    return this.http.get(url, { withCredentials: true }) as Observable<serverPacket>;
  } 

}

