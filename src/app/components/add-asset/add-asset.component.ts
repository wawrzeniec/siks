import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, NgForm, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormGroup, FormControl, FormGroupDirective, Validators, FormBuilder }  from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import { serverPacket, assetDescriptor } from '@server/assets/assets'
import { ConfigService } from '@app/services/config.service'
import { AssetService } from '@app/services/asset.service'
import { assetNumberString, currencyList } from '@server/assets/assets'

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
    Validators.required,
    Validators.pattern(/^\d+?\.?\d*?$/)
  ]);

  assetDetailsDateCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);

  assetDetailsPriceCtrl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d+?\.?\d*?$/)
  ]);

  assetDetailsCurrencyCtrl: FormControl = new FormControl('', [
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
  numberString: any = assetNumberString;
  currencyList: any = currencyList;
  currencyNames: string[] = Array();

  // Output data
  data: assetDescriptor;
  
  constructor(private dialogRef:MatDialogRef<AddAssetComponent>,
              public configservice: ConfigService,
              public assetservice: AssetService) { }

  ngOnInit() {
    this.getTypes().subscribe( (response: serverPacket) => {
      // Gets the data for default asset type              
      console.log(response);  
      for (let row of Object.values(response.data)) {
          console.log(row)
          if (row.hasOwnProperty('typename')) {
            console.log('push!')
            this.types.push(row['typename']);
          }
        }
      this.getAssetTypeData(this.types[0]);
      console.log(this.types)
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
    });
    this.addAssetDetailsGroup.patchValue({
      date: new Date()
    });

    // Confirm form
    this.addAssetConfirmGroup = new FormGroup({
      comment: new FormControl(),
      deduct: new FormControl(true)
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
        if (row.hasOwnProperty('categoryname')) {
          this.categories.push(row['categoryname']);
        }
      }
    });    

    // Queries the markets from the server
    this.configservice.getMarkets(assetType).subscribe( (response: serverPacket) => {
      this.markets = new Array();
      for (let row of Object.values(response.data)) {
        if (row.hasOwnProperty('marketname')) {
          this.markets.push(row['marketname']);
        }
      }

    });

    // Resets the selection
    this.addAssetIdGroup.patchValue({id: null});
    
  }

  addAsset() {
    //Gathers the data from all formGroups        
    this.data = new assetDescriptor();
    this.data['type'] = this.addAssetTypeGroup.get('type').value;
    this.data['id'] = this.addAssetIdGroup.get('id').value;
    this.data['number'] = this.addAssetDetailsGroup.get('number').value as number;
    this.data['date'] = this.addAssetDetailsGroup.get('date').value.toISOString().slice(0, 10);;
    this.data['price'] = this.addAssetDetailsGroup.get('price').value as number;
    this.data['currency'] = this.addAssetDetailsGroup.get('currency').value;
    this.data['comment'] = this.addAssetConfirmGroup.get('comment').value;
    this.data['deduct'] = this.addAssetConfirmGroup.get('deduct').value as boolean;
    
    // Pushes data to the server
    this.assetservice.addAsset(this.data).subscribe(result => {
      // Successfully inserted security => close dialog
      this.dialogRef.close();
    }, error => {
      // Error occurred => handle error
      // We should create an alert dialog class to handle these situations
    });
  }
  
}