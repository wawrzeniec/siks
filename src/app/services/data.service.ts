import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { serverPacket } from '@server/assets/assets'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl: string;
  private serverIP:string; 

  constructor(private http: HttpClient) { 
    this.serverIP = window.location.hostname;
    let schema = ServerConfig.https? 'https://' : 'http://';
    this.baseUrl = schema + this.serverIP + ':' + ServerConfig.port + '/data';
  }

  getSummary(): Observable<serverPacket> {
    // Get the "summary" total in CHF
    const url: string = this.baseUrl + '/summary'; 
    return this.http.get(url, { withCredentials: true }) as Observable<serverPacket>;
  }

  getHistory(mindate?: string): Observable<serverPacket> {
    // Get the "history" total in CHF
    const url: string = this.baseUrl + '/history'; 
    let params = new HttpParams();
    if (mindate) {
      params = params.append('mindate', mindate);
    }
    return this.http.get(url, { withCredentials: true, params: params }) as Observable<serverPacket>;
  }

  getBreakdown(maxdate?: string): Observable<serverPacket> {
    // Get the "breakdown" total in CHF
    const url: string = this.baseUrl + '/breakdown';    
    let params = new HttpParams();
    if (maxdate) {
      params = params.append('maxdate', maxdate);
    }
    return this.http.get(url, { withCredentials: true, params: params }) as Observable<serverPacket>;
  }

  getSecurityHistory(securityids: Array<number>, mindate?: string): Observable<serverPacket> {
    // Get the "history" total in CHF
    const url: string = this.baseUrl + '/security'; 
    let params = new HttpParams();
    params = params.append('securityids', securityids.toString())
    if (mindate) {
      params = params.append('mindate', mindate);
    }
    return this.http.get(url, { withCredentials: true, params: params }) as Observable<serverPacket>;
  }
}
