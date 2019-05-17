import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { serverPacket, assetDescriptor } from '@server/assets/assets';
import { ServerService } from '@app/services/server.service';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl: string;
  private pfUrl: string;
  
  constructor(private server: ServerService) { 
    this.baseUrl = '/accounts';
    this.pfUrl = '/portfolios';
  }

  getAccounts(): Observable<serverPacket> {
    // Retrieves the existing accounts for the current user
    const url: string = this.baseUrl; 
    return this.server.get(url, { withCredentials: true });
  }

  addAccount(accountspec: any): Observable<serverPacket> {
    // Adds a new account for the current user
    const url: string = this.baseUrl; 
    return this.server.post(url, accountspec, { withCredentials: true });
  }

  getPortfolios(): Observable<serverPacket> {
    // Retrieves the existing portfolios for the current user
    const url: string = this.pfUrl; 
    return this.server.get(url, { withCredentials: true });
  } 

}

