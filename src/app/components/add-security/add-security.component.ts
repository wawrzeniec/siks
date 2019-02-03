import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, NgForm, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormGroup, FormControl, FormGroupDirective, Validators, FormBuilder }  from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import { serverPacket, securityDescriptor, methodDescriptor } from '@app/modules/data/data.module'
import { currencyList, scrapeMethods } from '@app/modules/assets/assets.module'
import { ConfigService } from '@app/services/config.service'
import { QuoteService } from '@app/services/quote.service'
import { SecurityService } from '@app/services/security.service'

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
  disableMethod: disabledArray[] = [];
  isTesting: disabledArray[] = [];
  quote: quoteArray[] = [];

  categories: string[] = Array();
  markets: string[] = Array();
  currencyList: any = currencyList;
  currencyNames: string[] = Array();
  scrapeMethods: any = scrapeMethods;

  methods: methodDescriptor[];
  security: securityDescriptor;
  
  constructor(public dialog: MatDialog, 
              private dialogRef:MatDialogRef<AddSecurityComponent>,
              public configservice: ConfigService,
              public quoteservice: QuoteService, 
              public securityservice: SecurityService) { }

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
      markets: new FormControl(),
      currency: new FormControl()
    });

    // Watch methods form(s)
    for (let m in this.scrapeMethods) {
      this.addSecurityWatchGroup[m] = new FormGroup({});
      this.disableMethod[m] = <disabledArray>{};
      this.isTesting[m] = <disabledArray>{};
      this.quote[m] = <quoteArray>{};
      let d = this.scrapeMethods[m];
        for (let i=0; i < d.length; i++) {
          this.addSecurityWatchGroup[m].addControl('selected'+i, new FormControl(true));
          this.addSecurityWatchGroup[m].addControl('ticker'+i, new FormControl());
          this.addSecurityWatchGroup[m].addControl('test'+i, new FormControl());
          this.disableMethod[m][i] = false;
          this.isTesting[m][i] = false;
          this.quote[m][i] = "";
        }
    }

    // Confirm form
    this.addSecurityConfirmGroup = new FormGroup({
      watch: new FormControl(true)
    });
  }

  // Disables the "test" buttons if the watch method is disabled
  toggleButton(i: number)
  {
    console.log(i);
    let category = this.addSecurityCategoryGroup.get('category').value;
    let state = this.addSecurityWatchGroup[category].get('selected'+i).value;
    let action = state ? 'enable' : 'disable';
    console.log(state);
    this.addSecurityWatchGroup[category].get('ticker'+i)[action]();    
    this.disableMethod[category][i] = !state; 
  }

  // Callback for the "test" button - queries the quote and subscribe to the server response
  testMethod(m: string, i: number) {
    let category = this.addSecurityCategoryGroup.get('category').value;
    console.log(this.disableMethod[this.addSecurityCategoryGroup.get('category').value]);
    let ticker = this.addSecurityWatchGroup[category].get('ticker'+i).value;
    console.log(m);
    console.log(this.isTesting);
    this.isTesting[category][i] = true;
    this.quote[category][i] = "";
    this.quoteservice.testMethod(m, ticker).subscribe(result => {
      console.log(result);
      this.isTesting[category][i] = false;
      this.quote[category][i] = result.data as string;
    }, error => {
      this.isTesting[category][i] = false;
      this.quote[category][i] = "Error";
    });
  }

  // Callback for form submission
  addSecurity() {
    this.security = new securityDescriptor();
    this.methods = [] as methodsDescriptor[];
    this.security.category = this.addSecurityCategoryGroup.get('category').value;
    this.security.identifier = this.addSecurityDetailsGroup.get('identifier').value;
    this.security.markets = this.addSecurityDetailsGroup.get('markets').value;
    this.security.currency = this.addSecurityDetailsGroup.get('currency').value;
    this.security.watch = this.addSecurityConfirmGroup.get('watch').value;
    
    // Extracts the methods
    let m = this.scrapeMethods[this.security.category];
    for (let i in m) {
      if (this.addSecurityWatchGroup[this.security.category].get('selected'+i).value) {
        // Method is selected, get values
        let thismethod = new methodDescriptor();
        thismethod.methodid = m[i][0];
        thismethod.parameters = this.addSecurityWatchGroup[this.security.category].get('ticker'+i).value;
        this.methods.push(thismethod);
      }
    }      
    this.security.methods = this.methods;

    // Now calls the security service instance to push this data into the DB
    this.securityservice.addSecurity(this.security).subscribe(result => {
      // Successfully inserted security => close dialog
      this.dialog.close();
    }, error => {
      // Error occurred => handle error
    });
  }

}
