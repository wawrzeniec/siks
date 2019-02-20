import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service'
import { loginDataContainer } from '@server/assets/assets'
import { FormsModule, ReactiveFormsModule, NgForm, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormGroup, FormControl, FormGroupDirective, Validators, FormBuilder }  from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userNameCtrl = new FormControl('', [
    Validators.required,
  ]);

  passwordCtrl = new FormControl('', [
    Validators.required,
  ]);

  // Members
  matcher = new MyErrorStateMatcher();
  loginData: loginDataContainer;
  loginFormGroup: FormGroup;
  wrongCred: boolean = false;

  constructor(public dialog: MatDialog, 
              private dialogRef:MatDialogRef<LoginComponent>,
              public authService: AuthService) { }

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      name: this.userNameCtrl,
      password: this.passwordCtrl,     
    });
  }

  submitForm() {
    console.log('Logging in...');
    this.loginData = new loginDataContainer();
    this.loginData.userName = this.userNameCtrl.value;
    this.loginData.password = this.loginFormGroup.get('password').value;
    this.authService.postLogin(this.loginData).subscribe(result => {
      // Successfully inserted security => close dialog
      this.wrongCred = true;
      this.dialogRef.close();
    }, error => {
      // Error occurred => handle error
      // We should create an alert dialog class to handle these situations
      this.wrongCred = true;
    });
  }
}
