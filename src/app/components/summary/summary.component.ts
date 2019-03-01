import { Component, OnInit } from '@angular/core'
import { DataService } from '@app/services/data.service'
import { EventService } from '@app/services/event.service'
import { ASSET_TYPES } from '@server/assets/assets'

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  data: any;
  total: string = '';
  currency: string = '';
  loading: boolean = false;
  tooltiptext: string;

  constructor(private dataService: DataService, 
    private eventService: EventService) { }

  ngOnInit() {    
    this.eventService.reloadSummaryEvent.register(() => this.displaySummary());        
  }

  displaySummary() {
    this.loading = true;
    this.dataService.getSummary().subscribe( response => {
      this.data = response.data;
      this.total = response.data.total;  
      this.currency = 'CHF';
      this.makeToolTip();
      this.loading = false;
      
    });
  }

  makeToolTip() {
    console.log(this.data);
    console.log(ASSET_TYPES);
    let text = {};    
    for (let i=0; i < this.data.identifier.length; i++) {
      let thistext = '<tr><td align="left">' + this.data.identifier[i] + ':</td><td align="left">' + this.data.value[i].toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '</td></tr>';
      let t = this.data.typename[i];
      if (text.hasOwnProperty(t)) {
        text[t] += thistext;
      }
      else {
        text[t] = thistext; 
      }
    }
    console.log(text);
    this.tooltiptext = '<table class="app-summary-tooltip-table">';
    for (let key in ASSET_TYPES) {
      let t = ASSET_TYPES[key];
      if (text.hasOwnProperty(t)) { 
        this.tooltiptext += '<tr><th colspan=2>' + t + '</th></tr>' + text[t];
      }
    }
    this.tooltiptext += '</table>'
    console.log(this.tooltiptext)
  }

}
