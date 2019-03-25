import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/services/data.service'
import { EventService } from '@app/services/event.service'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { ChartComponent } from '@swimlane/ngx-charts/release/common/charts/chart.component'
import { BaseChartComponent } from '@swimlane/ngx-charts/release/common/base-chart.component'
import { ConfigService } from '@app/services/config.service'
import { AccountService } from '@app/services/account.service'
import { FlexLayoutModule } from '@angular/flex-layout'
import { currencyList } from '@server/assets/assets';
import { FormGroup, FormControl } from '@angular/forms'

@Component({
  selector: 'app-security-graph',
  templateUrl: './security-graph.component.html',
  styleUrls: ['./security-graph.component.scss']
})
export class SecurityGraphComponent implements OnInit {

  displayChart: boolean = false;
  dataLoaded: number = 0;
  lineData: any = new Array();
  securityData: any = new Array();
  accountData: any = new Array();
  portfolioData: any = new Array();
  historyData: any = new Array();
  allData: any = {};
  added: any = {};
  displayed: any = undefined;
  groupby: string="instrinsic";
  listSelection: Array<string> = ["1"];
  currentSecurities: Array<number> = [1];
  mindate: Date = undefined;
  selectedFormControl: FormControl;
  yScaleMin: number = 0;
  yScaleMax: number = 1000;
  autoscale: boolean = true;
  yAxisLabel: string = "Value (CHF)";

  constructor(private dataService: DataService, 
              private eventService: EventService, 
              private configService: ConfigService,
              private accountService: AccountService) {
    this.mindate = new Date();
    this.mindate.setMonth(new Date().getMonth() - 1);
  }

  ngOnInit() {
    //this.eventService.reloadHistoryEvent.register(() => this.reload());         
    this.selectedFormControl = new FormControl();
    this.selectedFormControl.setValue([1]); 
    console.log('SecurityGraph::init');
    console.log(this.dataService);

  }

  ngAfterViewInit() {
    //this.listSelection = ["1"];
  }

  reload() {
    console.log('SecurityGraphComponent: reloading myself!!')

    this.dataLoaded = 0;
    this.added = {};
    this.allData = {};

    this.configService.getSecurities().subscribe((result) => {
      if (result.status == 200) {        
        this.processSecurityData(result.data);
        this.dataLoaded += 1;
        if(this.dataLoaded == 2) {
          this.pushData();
          this.displayData();
          this.displayChart = true;
        }
      }
      else {
        // Handle the error here
        console.log('Error while retrieving security data:');
        console.log(result);
      }
    });

    console.log(this.mindate);
    this.displayed = this.displayed?this.displayed:[1];
    console.log(this.displayed);
    this.dataService.getSecurityHistory(this.displayed, this.formatdate(this.mindate)).subscribe((result) => {
      if (result.status == 200) {        
        this.historyData = result.data;
        this.dataLoaded += 1;
        if(this.dataLoaded == 2) {
          this.pushData();
          this.displayData();
          this.displayChart = true;
        }
      }
      else {
        // Handle the error here
        console.log('Error while retrieving historical data:');
        console.log(result);
      }
    });
  }
  
  processSecurityData(data: any) {
    this.securityData =  new Array();
    for (let d of data) {
      this.securityData[d.securityid] = {
        "securityid": d.securityid,
        "identifier": d.identifier, 
        "typeid": d.typeid,
        "categoryid": d.categoryid,
        "currency": d.currency
      }
    }
  }

  processSelected() {
    let toLoad = [];
    console.log(this.added);    
    let listSelection = this.selectedFormControl.value;
    console.log(listSelection);
    this.displayed = [];
    for (let id of listSelection)
    {
      let sid = Number(id);
      console.log(sid)
      console.log(this.added.hasOwnProperty(sid));
      if (!this.added.hasOwnProperty(sid)) {
        toLoad.push(sid);
        this.currentSecurities.push(sid);
      }
      this.displayed.push(id);
    }    
    console.log('currentsec='+this.currentSecurities);
    console.log('toload='+toLoad)
    if (toLoad.length > 0) {
      this.dataService.getSecurityHistory(toLoad, this.formatdate(this.mindate)).subscribe((result) => {
        if (result.status == 200) {        
          this.historyData = result.data;
          this.pushData();
          this.displayData();
          }        
        else {
          // Handle the error here
          console.log('Error while retrieving historical data:');
          console.log(result);
        }
      });      
    }
    else {
      this.displayData();
    }
  }
  
  displayData() {
    let _lineData = [];
    console.log(this.displayed);
    for (let i of this.displayed) {
      _lineData.push(this.allData[i]);
    }
    console.log(_lineData)
    this.lineData = _lineData;
  }

  pushData() {
    if (this.dataLoaded >= 2) {
      let _lineData = new Array();
      this.lineData = {};
      let id;
      let name;
      console.log(this.securityData);
      for (let y of this.historyData) {        
        id = y.securityid;
        name = this.securityData[id].identifier;
      
        if (!this.added.hasOwnProperty(id)) {
          this.added[id] = {
            "index": _lineData.length,
          };
          _lineData.push({
            "name": name,
            "id": id,
            "series": new Array()
          });
        }
        if (y.chfvalue != null) {  
          _lineData[this.added[id].index]["series"].push({
            "name": new Date(y.timestamp),
            "value": y.chfvalue
          }); 
        }
      }  

      console.log(_lineData);
      for (let data of _lineData) {
        this.allData[data.id] = data;
      }
      console.log(this.allData)      
    }
    else {
      console.log('pushData() called but dataLoaded=' + this.dataLoaded);
    }
  }

  rePushData() {
    this.displayChart = false;
    setTimeout(() => {      
      this.displayChart = true;
    }, 0);
  }

  reDisplay() {
    if (!this.dataLoaded)
    {
      this.reload()
    }
    else {
      this.rePushData();
    }
  }

  setRange(event) {
    this.mindate = new Date();
    switch(event.value) {
      case "1w":
        this.mindate.setHours(this.mindate.getHours() - 7*24);
      break;
      case "1m":
        this.mindate.setMonth(this.mindate.getMonth() - 1);
      break;
      case "6m":
        this.mindate.setMonth(this.mindate.getMonth() - 6);
      break;
      case "1y":
        this.mindate.setFullYear(this.mindate.getFullYear() - 1);
      break;
      case "All":
        this.mindate = undefined; 
    }
    this.reload();
  }

  setZoom(event) {
    switch(event.value) {
      case "tight":
        this.autoscale=true;
        break;
      case "wide":
        this.autoscale=false;
        break;
    }
  }

  setCurrency(event) { }

  setDiff(event) { }

  formatdate(d?: Date) {
    return d? d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) : undefined;
  }
}
