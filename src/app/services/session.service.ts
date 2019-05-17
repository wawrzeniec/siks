import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServerConfig } from '@server/server-config-ng';
import { LoginComponent } from '@app/components/login/login.component';
import { Observable, throwError } from 'rxjs';
import { ServerService } from '@app/services/server.service';
import { EventService } from '@app/services/event.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private baseUrl: string = '/login';
  private serverIP:string; 
  private loginOpen: boolean = false;
  private isChecking: boolean = false;
  public checkSession: Observable<string>; 
  
  constructor(public dialog: MatDialog, 
              private server: ServerService,
              private event: EventService) {
    this.init();           
  }

  init() {
    this.checkSession = Observable.create((o) => this.doCheckSession(o));
    this.event.loginEvent.register(() => { return this.doLoginSync() });
  }
  
  doCheckSession(observer) {
    // This asks the server if the session is valid, and if not, 
    // Opens a login dialog.

    // If this.loginOpen, we are anyway logging in, so we can skip the session check altogether
    console.log('in doCheckSession()');
    if (!this.isChecking) {
      this.isChecking = true;                // Flag to avoid opening 2 login dialogs simultaneously
      const url: string = this.baseUrl;
      return this.server.get(url, { withCredentials: true }).subscribe( response => {        
        console.log('Logged in. Response=');
        console.log(response);        
        this.isChecking = false;
        observer.next('continueSession');
        observer.complete();
        }, (err) => {
        console.log('Session invalid. Err=');
        console.log(err);   
        const response = this.doLogin();
        if (response) {
          observer.next('renewSession');
          observer.complete();
        }
        else {
          return throwError('sessionInvalid');
        }
      });
    }
    observer.next('alreadyChecking')
    observer.complete();
  }

  async doLogin() {
    console.log('SessionService: in doLogin()');
    if (!this.loginOpen) {
      this.loginOpen = true;
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
        this.isChecking = false;      
      });
      return dialogRef;      
    }
    else{
      return false;
    }
  }
  
  doLoginSync() {
    console.log('SessionService: in doLogin()');
    if (!this.loginOpen) {
      this.loginOpen = true;
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
        this.isChecking = false;      
      });

      console.log('Returning afterClosed() promise');
      return dialogRef.afterClosed().toPromise();
    }
    else{
      return new Promise((resolve, reject) => resolve(false));
    }
  }
}
