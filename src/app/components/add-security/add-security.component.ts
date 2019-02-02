import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, NgForm, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormGroup, FormControl, FormGroupDirective, Validators, FormBuilder }  from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import { serverPacket } from '@app/modules/data/data.module'
import { currencyList, scrapeMethods } from '@app/modules/assets/assets.module'
import { ConfigService } from '@app/services/config.service'
import { QuoteService } from '@app/services/quote.service'

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
  isTesting: disabledArray = {};

  categories: string[] = Array();
  markets: string[] = Array();
  currencyList: any = currencyList;
  currencyNames: string[] = Array();
  scrapeMethods: any = scrapeMethods;

  category: string;
  identifier: string;
  market: string;
  currency: string;

  constructor(public dialog: MatDialog, 
              public configservice: ConfigService,
              public quoteservice: QuoteService) { }

  ngOnInit() {
    // Queries the categories
    this.configservice.getCategories('Security').subscribe( (response: serverPacket) => {
      for (let row of Object.values(response.data)) {
        this.categories.push(row.categoryname);
      }
    });
    this.configservice.getMarkets('Security').subscribe( (response: serverPacket) => {
        for (let row of Object.values(response.data)) {
          this.markets.push(row.marketname);
        }
    });
    //this.currencyList = currencyList;
    this.currencyNames = Object.keys(currencyList);
    
    this.addSecurityCategoryGroup = new FormGroup({
      category: this.securityCategoryCtrl
    });

    this.addSecurityDetailsGroup = new FormGroup({
      identifier: this.securityIdentifierCtrl,
      market: new FormControl(),
      currency: new FormControl()
    });

    console.log(this.scrapeMethods);
    for (let m in this.scrapeMethods) {
      console.log(m);
      this.addSecurityWatchGroup[m] = new FormGroup({});
      console.log(this.addSecurityWatchGroup);
      let d = this.scrapeMethods[m];
        for (let i=0; i < d.length; i++) {
          this.addSecurityWatchGroup[m].addControl('selected'+d[i][2], new FormControl([true]));
          this.addSecurityWatchGroup[m].addControl('ticker'+d[i][2], new FormControl());
          this.addSecurityWatchGroup[m].addControl('test'+d[i][2], new FormControl());
          this.disableMethod[d[i][2]] = false;
          this.isTesting[d[i][2]] = false;
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

  testMethod(m: [string, string, number, string]) {
    let category = this.addSecurityCategoryGroup.get('category').value;
    let ticker = this.addSecurityWatchGroup[category].get('ticker'+m[2]).value;
    this.isTesting[m[2]] = true;
    this.quoteservice.testMethod(m[3], ticker).subscribe(result => {
      console.log(result);
      this.isTesting[m[2]] = false;
    });
  }

}
