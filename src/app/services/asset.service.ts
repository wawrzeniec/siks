import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { serverPacket, assetDescriptor } from '@server/assets/assets'

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private baseUrl: string;
  private serverIP:string; 

  constructor(private http: HttpClient) { 
    this.serverIP = window.location.hostname;
    let schema = ServerConfig.https? 'https://' : 'http://';
    this.baseUrl = schema + this.serverIP + ':' + ServerConfig.port + '/asset';
  }

  addAsset(asset: assetDescriptor): Observable<serverPacket> {
    // Adds an asset to the portfolio
    const url: string = this.baseUrl; 
    return this.http.post(url, asset, { withCredentials: true }) as Observable<serverPacket>;
  }
}
