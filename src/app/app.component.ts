import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { LoginComponent } from '@app/components/login/login.component'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title: string = 'siks';
  loginOpen: boolean = false;
  
  constructor(public dialog: MatDialog, 
    public authService: AuthService) {
    
  };

  ngOnInit() {
    this.checkSession();
  }

  @HostListener('window:focus')
  onFocus(): void {
    this.checkSession();
  }

  checkSession() {
    if (!this.loginOpen) {
      this.loginOpen = true;
      this.authService.checkSession().subscribe( response => {
        console.log('Checking session status')
        console.log(response);      
        console.log('LOGGED IN');
        this.loginOpen = false;
        }, (err) => {
        console.log('Not logged in => opening dialog')          
          const dialogRef = this.dialog.open(LoginComponent, {
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


