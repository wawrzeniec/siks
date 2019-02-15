import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, NgForm, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormGroup, FormControl, FormGroupDirective, Validators, FormBuilder }  from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import { serverPacket, securityDescriptor } from '@app/modules/data/data.module'
import { ConfigService } from '@app/services/config.service'
import { SecurityService } from '@app/services/security.service'
import { assetNumberString, currencyList } from '@app/modules/assets/assets.module'

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.scss']
})
export class AddAssetComponent implements OnInit {
    
  // Form validators
  assetTypeCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);

  assetCategoryCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);

  assetIdCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);

  assetDetailsNumberCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);

  assetDetailsDateCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);

  assetDetailsPriceCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);

  assetDetailsCurrencyCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);
  
  assetDetailsCommentCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);

  addAssetTypeGroup: FormGroup;
  addAssetCategoryGroup: FormGroup;
  addAssetIdGroup: FormGroup;
  addAssetDetailsGroup: FormGroup;
  addAssetConfirmGroup: FormGroup;
  
  types: string[] = Array();
  categories: string[] = Array();
  markets: string[] = Array();

  // Some hard-coded assets
  numberString: string[] = assetNumberString;
  currencyList: any = currencyList;
  currencyNames: string[] = Array();
  
  // Variables to hold the data
  selectedType: string;
  
  constructor(private dialogRef:MatDialogRef<AddAssetComponent>,
              public configservice: ConfigService,
              public securityservice: SecurityService) { }

  ngOnInit() {
    this.getTypes().subscribe( (response: serverPacket) => {
      // Gets the data for default asset type      
        for (let row of Object.values(response.data)) {
          this.types.push(row.typename);
        }
      this.getAssetTypeData(this.types[0]);
    });
    
    this.currencyNames = Object.keys(currencyList);

    // Category form
    this.addAssetTypeGroup = new FormGroup({
      type: this.assetTypeCtrl
    });

    // Category form
    this.addAssetCategoryGroup = new FormGroup({
      category: this.assetCategoryCtrl
    });

    // Type form
    this.addAssetIdGroup = new FormGroup({
      id: this.assetIdCtrl
    });

    // Details form
    this.addAssetDetailsGroup = new FormGroup({
      number: this.assetDetailsNumberCtrl,
      date: this.assetDetailsDateCtrl,
      price: this.assetDetailsPriceCtrl,
      currency: this.assetDetailsCurrencyCtrl,
      comment: this.assetDetailsCommentCtrl
    });

  }

  // TODO: 
  // Cash: enter number, currency, price (in other currency?) and date + comment. 
  //       on backend, there is no securityid.
  //       The target currency can be specified by the securityid.   
  //       if there is no security of this type with this currency, add one to securities. 
  //       since it will have no watch methods, it will not be watched, but currencies are watched automatically. 
  //       Wait they are not ==> add watch method. 
  //       In fact whenever a new security is added with a new currency, it should be added to securities. 
  //       Then we remove the auto-watch of currencies.
  //
  // Secu: enter number, date, price currency comment. Add entry.
  // Other ~ enter too. 
  // 
  // Also when bought, the price, in given currency, can be deducted from available cash. 
  // This makes another entry, negative, in investments. If the current asset in the given currency does 
  // not suffice, we might want to emit a warning (set (color)=x with x='warn' on the form field) 
  //
  // We can split in (1) type, (2) id and number (currency: choose target, secu: list of cards with filter), 
  // (3) date, price and comment. 

  getTypes() {
    // Queries the available asset types from the database
    return this.configservice.getTypes();
  }

  getAssetTypeData(assetType?: string) {
    // Queries the categories from the server
    if (!assetType) {
      assetType = this.addAssetTypeGroup.get('type').value;
    }
    this.configservice.getCategories(assetType.toString()).subscribe( (response: serverPacket) => {
      this.categories = [];
      for (let row of Object.values(response.data)) {
        this.categories.push(row.categoryname);
      }
    });    

    // Queries the markets from the server
    this.configservice.getMarkets(assetType).subscribe( (response: serverPacket) => {
      this.markets = new Array();
      for (let row of Object.values(response.data)) {
        this.markets.push(row.marketname);
      }
    });
  }

  setSelected(row) {
    console.log(row);
  }
}
