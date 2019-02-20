import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { serverPacket } from '@server/assets/assets'

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private baseUrl: string;
  private serverIP:string; 

  constructor(private http: HttpClient) { 
    this.serverIP = window.location.hostname;
    let schema = ServerConfig.https? 'https://' : 'http://';
    this.baseUrl = schema + this.serverIP + ':' + ServerConfig.port + '/quote';

  }

  testMethod(method: string, ticker: string): Observable<serverPacket> {
    // Tests a scrape method and returns the quote or an error
    let params = new HttpParams();
    params = params.append('method', method);
    params = params.append('ticker', ticker);    
    const url: string = this.baseUrl; 
    console.log('Requesting quote for ' + ticker + ' using method ' + method);
    return this.http.get(url, {params: params, withCredentials: true }) as Observable<serverPacket>;
  }
}
