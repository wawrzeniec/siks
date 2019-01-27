import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, NgForm, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormGroup, FormControl, FormGroupDirective, Validators, FormBuilder }  from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ErrorStateMatcher} from '@angular/material/core';
import { DataModule, userDataContainer } from '@app/modules/data/data.module'
import { currenciesList } from '@app/modules/assets/assets.module'
import { ConfigService } from '@app/services/config.service'

interface FormGroupObject {
  [key: string]: FormGroup
}

interface disabledArray {
  [key: number]: boolean
}

@Component({
  selector: 'app-add-security',
  templateUrl: './add-security.component.html',
  styleUrls: ['./add-security.component.scss']
})
export class AddSecurityComponent implements OnInit {

  securityCategoryCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);

  securityIdentifierCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);

  addSecurityCategoryGroup: FormGroup;
  addSecurityDetailsGroup: FormGroup;
  addSecurityWatchGroup: FormGroupObject = {};
  disableMethod: disabledArray = {};

  categories: string[] = Array();
  markets: string[] = Array();
  currenciesList: Object;
  currencyNames: string[] = Array();
  methods: any = {
    'ETF': [
      ['Google finance', 'Enter google finance ticker', 0],
      ['Yahoo finance', 'Enter yahoo finance ticker', 1]
    ],
    'Fund': [
      ['Other1', 'Enter other1 prop', 2],
      ['Other2', 'Enter other2 prop', 3]
    ]
  };

  category: string;
  identifier: string;
  market: string;
  currency: string;

  constructor(public dialog: MatDialog, public configservice: ConfigService) { }

  ngOnInit() {
    // Queries the categories
    this.configservice.getCategories('Security').subscribe( (response: Object) => {
      for (let row of response.data) {
        this.categories.push(row.categoryname);
      }
    });
    this.configservice.getMarkets('Security').subscribe( (response: Object) => {
        for (let row of response.data) {
          this.markets.push(row.marketname);
        }
    });
    this.currenciesList = currenciesList;
    this.currencyNames = Object.keys(currenciesList);
    


    this.addSecurityCategoryGroup = new FormGroup({
      category: this.securityCategoryCtrl
    });

    this.addSecurityDetailsGroup = new FormGroup({
      identifier: this.securityIdentifierCtrl,
      market: new FormControl(),
      currency: new FormControl()
    });

    for (let m in this.methods) {
      console.log(m);
      this.addSecurityWatchGroup[m] = new FormGroup({});
      console.log(this.addSecurityWatchGroup);
      let d = this.methods[m];
        for (let i=0; i < d.length; i++) {
          this.addSecurityWatchGroup[m].addControl('selected'+d[i][2], new FormControl([true]));
          this.addSecurityWatchGroup[m].addControl('ticker'+d[i][2], new FormControl());
          this.addSecurityWatchGroup[m].addControl('test'+d[i][2], new FormControl());
          this.disableMethod[i] = false;
        }
    }
    console.log(this.addSecurityWatchGroup);
  }

  toggleButton(m: number)
  {
    let state = this.addSecurityWatchGroup[this.addSecurityCategoryGroup.get('category').value].get('selected'+m).value;
    let action = state ? 'enable' : 'disable';
    this.addSecurityWatchGroup[this.addSecurityCategoryGroup.get('category').value].get('ticker'+m)[action]();    
    this.disableMethod[m] = !state; 
  }

  testMethod(m: number) {
    console.log('Testing method ' + m + ' with parameter [' + this.addSecurityWatchGroup[this.addSecurityCategoryGroup.get('category').value].get('ticker'+m).value + ']');
  }
}
