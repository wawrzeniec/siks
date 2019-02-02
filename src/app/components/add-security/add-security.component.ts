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

interface quoteArray {
  [key: number]: string
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
  addSecurityConfirmGroup: FormGroup;
  disableMethod: disabledArray = {};
  isTesting: disabledArray = {};
  quote: quoteArray = {};

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
    // Queries the categories from the server
    this.configservice.getCategories('Security').subscribe( (response: serverPacket) => {
      for (let row of Object.values(response.data)) {
        this.categories.push(row.categoryname);
      }
    });
    // Queries the markets from the server
    this.configservice.getMarkets('Security').subscribe( (response: serverPacket) => {
        for (let row of Object.values(response.data)) {
          this.markets.push(row.marketname);
        }
    });
    this.currencyNames = Object.keys(currencyList);
    
    // Category form
    this.addSecurityCategoryGroup = new FormGroup({
      category: this.securityCategoryCtrl
    });

    // Details form
    this.addSecurityDetailsGroup = new FormGroup({
      identifier: this.securityIdentifierCtrl,
      market: new FormControl(),
      currency: new FormControl()
    });

    // Watch methods form(s)
    for (let m in this.scrapeMethods) {
      this.addSecurityWatchGroup[m] = new FormGroup({});
      let d = this.scrapeMethods[m];
        for (let i=0; i < d.length; i++) {
          this.addSecurityWatchGroup[m].addControl('selected'+d[i][2], new FormControl([true]));
          this.addSecurityWatchGroup[m].addControl('ticker'+d[i][2], new FormControl());
          this.addSecurityWatchGroup[m].addControl('test'+d[i][2], new FormControl());
          this.disableMethod[d[i][2]] = false;
          this.isTesting[d[i][2]] = false;
          this.quote[d[i][2]] = "";
        }
    }
    
    // Confirm form
    this.addSecurityConfirmGroup = new FormGroup({
      watch: new FormControl([true])
    });
  }

  // Disables the "test" buttons if the watch method is disabled
  toggleButton(m: number)
  {
    let state = this.addSecurityWatchGroup[this.addSecurityCategoryGroup.get('category').value].get('selected'+m).value;
    let action = state ? 'enable' : 'disable';
    this.addSecurityWatchGroup[this.addSecurityCategoryGroup.get('category').value].get('ticker'+m)[action]();    
    this.disableMethod[m] = !state; 
  }

  // Callback for the "test" button - queries the quote and subscribe to the server response
  testMethod(m: [string, string, number, string]) {
    let category = this.addSecurityCategoryGroup.get('category').value;
    let ticker = this.addSecurityWatchGroup[category].get('ticker'+m[2]).value;
    this.isTesting[m[2]] = true;
    this.quote[m[2]] = "";
    this.quoteservice.testMethod(m[3], ticker).subscribe(result => {
      console.log(result);
      this.isTesting[m[2]] = false;
      this.quote[m[2]] = result.data as string;
    });
  }

  // Callback for form submission
  addSecurity() {

  }

}
