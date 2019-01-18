import { Component, OnInit, Input, Directive } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm, ValidatorFn, ValidationErrors } from '@angular/forms';
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
  confirmPasswordDisabled: boolean = false;
  addUserFormGroup: FormGroup;
  userNameCtrl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(32),
    Validators.pattern('^([1-zA-Z0-1@.\s]{1,255})$')
  ]);

  emailCtrl = new FormControl('', [
    Validators.required,
    Validators.maxLength(64),
    //Validators.email,
    Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  ]);

  passwordCtrl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(32),
    Validators.pattern(/^([1-zA-Z0-1@.\s]{1,255})$/)
  ]);

  confirmPasswordCtrl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(32),
    Validators.pattern(/^([1-zA-Z0-1@.\s]{1,255})$/),
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(public dialog: MatDialog) {
  }  

  ngOnInit() {
    this.addUserFormGroup = new FormGroup({
      password: this.passwordCtrl,
      confirmPassword: new FormControl({ value: '', disabled: true }),  //this.confirmPasswordCtrl
    }, { validators: this.checkPasswords })            
  }

  ngAfterViewInit() {
    this.confirmPasswordCtrl['disable']();
  }

  logit() {
    console.log('Creating user...');
    console.log('before:');
    console.log(this.confirmPasswordDisabled);
    console.log('after:');
  }

  checkPasswords: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
   
    console.log('hasserror:');
    //console.log(control.hasError('passwordMismatch'));
    console.log(confirmPassword)
    const error = password && confirmPassword && password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
    if (error) {
      //confirmPassword.status="INVALID";
      //if (password)
      confirmPassword.setErrors({'passwordMismatch': true});
    }

    // Disables the confirm password field as long as the password is not valid
    let pwInvalid = password.status === "INVALID";
    this.confirmPasswordDisabled = pwInvalid;

    return error;  
  };

  initConfirmPassword() {
    this.addUserFormGroup.get('confirmPassword')['disable']();
  }
  
}

