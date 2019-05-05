import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { serverPacket } from '@server/assets/assets'
import { ServerService } from '@app/services/server.service';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private baseUrl: string;
  
  constructor(private server: ServerService) {  
    this.baseUrl = '/quote';

  }

  testMethod(method: string, ticker: string): Observable<serverPacket> {
    // Tests a scrape method and returns the quote or an error
    let params = new HttpParams();
    params = params.append('method', method);
    params = params.append('ticker', ticker);    
    const url: string = this.baseUrl; 
    console.log('Requesting quote for ' + ticker + ' using method ' + method);
    return this.server.get(url, {params: params, withCredentials: true }) as Observable<serverPacket>;
  }
}
