import { Component, OnInit } from '@angular/core';
import { Input, OnChanges, Output, EventEmitter } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ConfigService } from '@app/services/config.service'
import { securityDescriptor } from '@app/modules/data/data.module'
import { MatTableModule } from '@angular/material/table'
import { MatTableDataSource, MatSort } from '@angular/material'
import { securityFieldsDescriptor } from '@app/modules/assets/assets.module'

@Component({
  selector: 'app-select-asset-id',
  templateUrl: './select-asset-id.component.html',
  styleUrls: ['./select-asset-id.component.scss']
})
export class SelectAssetIdComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() formControlField: string;
  @Input() type: string; 
  @Output() onSelect = new EventEmitter();
  selectedRow: number = undefined;

  public fields: string[] = securityFieldsDescriptor;
  public dataSource: MatTableDataSource<securityDescriptor> = new MatTableDataSource<securityDescriptor>();

  constructor(public configService: ConfigService) { }

  ngOnInit() { 
    let value = this.formGroup.get(this.formControlField).value;
    if (value) {
      this.selectedRow = value;
    }
  }

  ngOnChanges() {
    // Gets the securities for the new type
    this.configService.getSecurities(this.type).subscribe(result => {
      this.dataSource = result.data as MatTableDataSource<securityDescriptor>;      
    });    

    // Cancels the selection
    this.updateValue(null)
  }

  updateSelected(row) {
    this.updateValue(row.securityid);
    this.onSelect.emit(row.securityid);
  }

  updateValue(v) {
    this.selectedRow = v;   
    let value: any = {}; 
    value[this.formControlField] = this.selectedRow;
    this.formGroup.patchValue(value);
  }
}
