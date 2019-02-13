import { Component, OnInit } from '@angular/core';
import { Input, OnChanges } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ConfigService } from '@app/services/config.service'

@Component({
  selector: 'app-select-asset-id',
  templateUrl: './select-asset-id.component.html',
  styleUrls: ['./select-asset-id.component.scss']
})
export class SelectAssetIdComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() type: string; 

  constructor(public configservice: ConfigService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('Changes: ' + this.type);
  }

}
