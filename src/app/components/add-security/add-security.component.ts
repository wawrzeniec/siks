import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormGroup, FormControl, FormGroupDirective, Validators, FormBuilder }  from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ErrorStateMatcher} from '@angular/material/core';
import { DataModule, userDataContainer } from '@app/modules/data/data.module'
import { currenciesList } from '@app/modules/assets/assets.module'

@Component({
  selector: 'app-add-security',
  templateUrl: './add-security.component.html',
  styleUrls: ['./add-security.component.scss']
})
export class AddSecurityComponent implements OnInit {

  securityIdentifierCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);

  securityGFCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);

  addSecurityCategoryGroup: FormGroup;
  addSecurityDetailsGroup: FormGroup;
  addSecurityWatchGroup: FormGroup;
  
  categories: string[] = Array();
  markets: string[] = Array();
  currenciesList: Object;
  currencyNames: string[] = Array();
  methodChecked: boolean = false;


  category: string;
  identifier: string;
  market: string;
  currency: string;
  
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.categories = ['ETF', 'Fund'];
    this.markets = ['A', 'B'];
    this.currenciesList = currenciesList;
    this.currencyNames = Object.keys(currenciesList);
    
    this.addSecurityCategoryGroup = new FormGroup({
      category: new FormControl(['', Validators.required])
    });

    this.addSecurityDetailsGroup = new FormGroup({
      identifier: this.securityIdentifierCtrl,
      market: new FormControl(),
      currency: new FormControl()
    });

    this.addSecurityWatchGroup = new FormGroup({
      gf: new FormControl(),
      gfticker:new FormControl(),
      yf: new FormControl(),
      yfticker:new FormControl()
    });
  }

  dispme()
  {
    console.log(this.addSecurityWatchGroup.get('gf').value);
    this.methodChecked = !this.methodChecked;
  }

}
