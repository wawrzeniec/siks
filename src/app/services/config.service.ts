import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { serverPacket } from '@app/modules/data/data.module'

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private baseUrl: string;
  private serverIP:string; 

  constructor(private http: HttpClient) { 
    this.serverIP = window.location.hostname;
    let schema = ServerConfig.https? 'https://' : 'http://';
    this.baseUrl = schema + this.serverIP + ':' + ServerConfig.port + '/config/';

  }

  getCategories(type?: string): Observable<serverPacket> {
    // Retrieves the list of categories
    // 200 => OK
    // 503 => SQLITE Error
    let params = new HttpParams();
    if (type) {
      params = params.append('type', type);
    }

    const url: string = this.baseUrl + 'categories'; 
    return this.http.get(url, {params: params}) as Observable<serverPacket>;
  }

  getMarkets(type?: string): Observable<serverPacket> {
    // Retrieves the list of markets, filtering by type if provided
    // 200 => OK
    // 503 => SQLITE Error
    let params = new HttpParams();
    if (type) {
      params = params.append('type', type);
    }

    const url: string = this.baseUrl + 'markets'; 
    return this.http.get(url, {params: params}) as Observable<serverPacket>;
  }

}