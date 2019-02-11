import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AddUserComponent } from '@app/components/add-user/add-user.component'
import { AddSecurityComponent } from '@app/components/add-security/add-security.component'
import { AddAssetComponent } from '@app/components/add-asset/add-asset.component'

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

    dialogRef.afterClosed().subscribe(userData => {
      console.log('The dialog was closed');
      // Here do something with userData
      console.log(userData);
    });
  }

  openAddSecurity() {
    const dialogRef = this.dialog.open(AddSecurityComponent, {
    });

    dialogRef.afterClosed().subscribe(userData => {
      console.log('The dialog was closed');
      // Here do something with userData
      console.log(userData);
    });
  }

  openAddAsset() {
    const dialogRef = this.dialog.open(AddAssetComponent, {
    });

    dialogRef.afterClosed().subscribe(userData => {
      console.log('The dialog was closed');
      // Here do something with userData
      console.log(userData);
    });
  }
}
