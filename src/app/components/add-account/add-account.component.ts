import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/services/account.service'
import { EventService } from '@app/services/event.service'
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
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  accountNameCtrl = new FormControl('', [
    Validators.required
  ]);

  matcher = new MyErrorStateMatcher();
  addAccountFormGroup: FormGroup;

  constructor(private dialog: MatDialog, 
              private dialogRef:MatDialogRef<AddAccountComponent>,
              private accountService: AccountService) { }

  ngOnInit() {
    this.addAccountFormGroup = new FormGroup({
      name: this.accountNameCtrl
    });
  }

  submitForm() {
    console.log('Adding account...');
    let accountName = this.addAccountFormGroup.get('name').value;

    this.accountService.addAccount({name: accountName}).subscribe(result => {
      // Successfully add account => close the dialog
      this.dialogRef.close({reloadAccounts: true});
    }, error => {
      // Error occurred => handle error
      // We should create an alert dialog class to handle these situations      
    });
  }

  cancel() {
    console.log('Cancelling');
    this.dialogRef.close({reloadAccounts: false});
  }

}
