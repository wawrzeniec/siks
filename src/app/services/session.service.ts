import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { LoginComponent } from '@app/components/login/login.component'

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private baseUrl: string;
  private serverIP:string; 
  private loginOpen: boolean = false;

  constructor(public dialog: MatDialog, 
              private http: HttpClient) {
    this.serverIP = window.location.hostname;
    let schema = ServerConfig.https? 'https://' : 'http://';
    this.baseUrl = schema + this.serverIP + ':' + ServerConfig.port + '/login';
  }

  checkSession() {
    // This asks the server if the session is valid, and if not, 
    // Opens a login dialog.

    // If this.loginOpen, we are anyway logging in, so we can skip the session check altogether
    if (!this.loginOpen) {
      this.loginOpen = true;                // Flag to avoid opening 2 login dialogs simultaneously
      const url: string = this.baseUrl;
      return this.http.get(url, { withCredentials: true }).subscribe( response => {
        console.log('Checking session status')
        console.log(response);      
        console.log('Logged in.');
        this.loginOpen = false;
        }, (err) => {
        console.log('Not logged in => opening dialog')          
          const dialogRef = this.dialog.open(LoginComponent, {
            panelClass: 'app-dialog-panel-login',
            height: '400px',
            width: '800px',
            disableClose: true 
          });
      
          dialogRef.afterClosed().subscribe(response => {
            console.log('The login dialog was closed');
            // Here do something with userData
            console.log(response);
            this.loginOpen = false;
          });
      });
    }
  }
}