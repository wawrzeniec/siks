import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, FormGroupDirective, Validators, FormBuilder }  from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ErrorStateMatcher} from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface userData {
  userName: string;
  password: string;
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  data: userData;
  addUserFormGroup: FormGroup;
  userNameCtrl: FormControl;
  passwordCtrl: FormControl;
  passwordCheckCtrl: FormControl;
  matcher: MyErrorStateMatcher;

  constructor(public dialog: MatDialog) {}
  
  
  ngOnInit() {
    
    this.userNameCtrl = new FormControl('', [
      Validators.required
    ]);

    this.passwordCtrl = new FormControl('', [
      Validators.required
    ]);

    this.passwordCheckCtrl = new FormControl('', [
      Validators.required
    ]);
  
    this.matcher = new MyErrorStateMatcher();
   }
  }

