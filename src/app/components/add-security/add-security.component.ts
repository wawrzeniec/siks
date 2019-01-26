import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormGroup, FormControl, FormGroupDirective, Validators, FormBuilder }  from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ErrorStateMatcher} from '@angular/material/core';
import { DataModule, userDataContainer } from '../../modules/data/data.module'

@Component({
  selector: 'app-add-security',
  templateUrl: './add-security.component.html',
  styleUrls: ['./add-security.component.scss']
})
export class AddSecurityComponent implements OnInit {

  addSecurityAmountCtrl = new FormControl('', [
    Validators.required,
    Validators.pattern('^([0-9]+\.?[0-9]+)$')
  ]);

  addSecurityGFCtrl = new FormControl('', [
    Validators.required
  ]);

  addSecurityCategoryGroup: FormGroup;
  addSecurityAmountGroup: FormGroup;
  addSecurityWatchGroup: FormGroup;
  categories: string[] = Array();

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.categories = ['ETF', 'Fund'];
    this.addSecurityCategoryGroup = new FormGroup({
      category: new FormControl(['', Validators.required])
    });
    this.addSecurityAmountGroup = new FormGroup({
      amount: this.addSecurityAmountCtrl
    });
    this.addSecurityWatchGroup = new FormGroup({
      gf: new FormControl(),
      gfticker: this.addSecurityGFCtrl
    });
  }
}
