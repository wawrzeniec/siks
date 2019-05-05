import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { serverPacket, assetDescriptor } from '@server/assets/assets'
import { ServerService } from '@app/services/server.service';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private baseUrl: string;
  private serverIP:string; 

  constructor(private server: ServerService) { 
    this.baseUrl = '/asset';
  }

  addAsset(asset: assetDescriptor): Observable<serverPacket> {
    // Adds an asset to the portfolio
    const url: string = this.baseUrl; 
    return this.server.post(url, asset, { withCredentials: true }) as Observable<serverPacket>;
  }
}
