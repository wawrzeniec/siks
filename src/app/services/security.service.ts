import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { serverPacket, securityDescriptor } from '@server/assets/assets'
import { ServerService } from '@app/services/server.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private baseUrl: string;
  
  constructor(private server: ServerService) { 
    this.baseUrl = '/security';
  }

  addSecurity(security: securityDescriptor): Observable<serverPacket> {
    // Adds a security to the list of securities
    const url: string = this.baseUrl; 
    return this.server.post(url, security, { withCredentials: true });
  }
}
