import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, NgForm, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormGroup, FormControl, FormGroupDirective, Validators, FormBuilder }  from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import { serverPacket, securityDescriptor } from '@app/modules/data/data.module'
import { ConfigService } from '@app/services/config.service'
import { SecurityService } from '@app/services/security.service'

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.scss']
})
export class AddAssetComponent implements OnInit {
  
  // Form control for the type of security
  securityCategoryCtrl: FormControl = new FormControl('', [
    Validators.required
  ]);

  addAssetTypeGroup: FormGroup;
  addAssetCategoryGroup: FormGroup;
  addAssetDetailsGroup: FormGroup;
  addAssetConfirmGroup: FormGroup;
  
  types: string[] = Array();
  categories: string[] = Array();
  markets: string[] = Array();
  
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
    
    // Category form
    this.addAssetCategoryGroup = new FormGroup({
      category: this.securityCategoryCtrl
    });

    // Details form
    this.addAssetDetailsGroup = new FormGroup({
      quantity: new FormControl()
    });

  }

  getTypes() {
    // Queries the available asset types from the database
    return this.configservice.getTypes();
  }

  getAssetTypeData(assetType: string) {
    // Queries the categories from the server
    this.configservice.getCategories(assetType).subscribe( (response: serverPacket) => {
      this.categories = new Array();
      for (let row of Object.values(response.data)) {
        this.categories.push(row.categoryname);
      }
    });
    console.log(this.categories);

    // Queries the markets from the server
    this.configservice.getMarkets(assetType).subscribe( (response: serverPacket) => {
      this.markets = new Array();
      for (let row of Object.values(response.data)) {
        this.markets.push(row.marketname);
      }
    });
  }

}
