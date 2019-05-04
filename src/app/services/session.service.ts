import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { LoginComponent } from '@app/components/login/login.component';
import { Observable } from 'rxjs';
import { ServerService } from '@app/services/server.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private baseUrl: string;
  private serverIP:string; 
  private loginOpen: boolean = false;
  private isChecking: boolean = false;
  public checkSession: Observable<string>; 
  
  constructor(public dialog: MatDialog, 
              private server: ServerService) {
    this.serverIP = ServerConfig.ip;
    let schema = ServerConfig.https? 'https://' : 'http://';
    this.baseUrl = schema + this.serverIP + ':' + ServerConfig.port + '/login';

    this.checkSession = Observable.create((o) => this.doCheckSession(o));
  }
  
  doCheckSession(observer) {
    // This asks the server if the session is valid, and if not, 
    // Opens a login dialog.

    // If this.loginOpen, we are anyway logging in, so we can skip the session check altogether
    console.log(this);
    if (!this.isChecking) {
      this.isChecking = true;                // Flag to avoid opening 2 login dialogs simultaneously
      const url: string = this.baseUrl;
      return this.server.get(url, { withCredentials: true }).subscribe( response => {
        console.log('Logged in.');        
        observer.next('continueSession');
        }, (err) => {
        console.log('Not logged in => opening dialog')          
        if (!this.loginOpen) {
          this.doLogin().afterClosed().subscribe(result => {
            observer.next('startSession');
            this.isChecking = false;
          });
        }
      });
    }
  }

  doLogin() {
    const dialogRef = this.dialog.open(LoginComponent, {
      panelClass: 'app-dialog-panel-login',            
      hasBackdrop: true,
      backdropClass: 'app-dialog-backdrop-login',
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(response => {
      console.log('The login dialog was closed');
      // Here do something with userData
      console.log(response);
      this.loginOpen = false;          
    });
    return dialogRef;
  }
}
