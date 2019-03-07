import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AddUserComponent } from '@app/components/add-user/add-user.component'
import { AddSecurityComponent } from '@app/components/add-security/add-security.component'
import { AddAssetComponent } from '@app/components/add-asset/add-asset.component'
import { AddAccountComponent } from '@app/components/add-account/add-account.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@app/services/auth.service'
import { SessionService } from '@app/services/session.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit { 

  constructor(public dialog: MatDialog,
              private authService: AuthService,
              private sessionService: SessionService
              ) {}

  signOutAlt = faSignOutAlt;

  ngOnInit() {
  }
  
  openAddUser() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      height: '400px',
      width: '800px',
    });

  }

  openAddSecurity() {
    const dialogRef = this.dialog.open(AddSecurityComponent, {
    });
  }

  openAddAsset() {
    const dialogRef = this.dialog.open(AddAssetComponent, {
    });
  }

  openAddAccount() {
    const dialogRef = this.dialog.open(AddAccountComponent, {
    });
  }

  logout() {
    console.log('Logging out...')
    this.authService.logout().subscribe((result) => {
      this.sessionService.checkSession.subscribe((data) => console.log(data));
    });
  }
}
