import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AddUserComponent } from '@app/components/add-user/add-user.component'
import { AddSecurityComponent } from '@app/components/add-security/add-security.component'
import { AddAssetComponent } from '@app/components/add-asset/add-asset.component'
import { AddAccountComponent } from '@app/components/add-account/add-account.component'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit { 

  constructor(public dialog: MatDialog) {    
  }

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
}
