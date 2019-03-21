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
  added: any = {};
  groupby: string="instrinsic";
  listSelection: Array<string> = ["1"];
  currentSecurities: Array<number> = [1];
  mindate: Date = undefined;

  constructor(private dataService: DataService, 
              private eventService: EventService, 
              private configService: ConfigService,
              private accountService: AccountService) { }

  ngOnInit() {
    //this.eventService.reloadHistoryEvent.register(() => this.reload());     
    this.mindate = new Date();
    this.mindate.setMonth(new Date().getMonth() - 1);

    console.log('SecurityGraph::init');
    console.log(this.dataService);

  }

  ngAfterViewInit() {
    this.listSelection = ["1"];
  }

  reload() {
    console.log('SecurityGraphComponent: reloading myself!!')
    this.dataLoaded = 0;
    this.configService.getSecurities().subscribe((result) => {
      if (result.status == 200) {        
        this.processSecurityData(result.data);
        this.dataLoaded += 1;
        if(this.dataLoaded == 2) {
          this.pushData();
          this.displayChart = true;
        }
      }
      else {
        // Handle the error here
        console.log('Error while retrieving security data:');
        console.log(result);
      }
    });

    console.log('securityids=' + this.currentSecurities)
    this.dataService.getSecurityHistory(this.currentSecurities?this.currentSecurities:[1], this.formatdate(this.mindate)).subscribe((result) => {
      if (result.status == 200) {        
        this.historyData = result.data;
        this.dataLoaded += 1;
        if(this.dataLoaded == 2) {
          this.pushData();
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
    console.log(this.currentSecurities)
    for (let id of this.listSelection)
    {
      console.log(id as number)
      console.log(this.added.hasOwnProperty(id as number))
      if (!this.added.hasOwnProperty(id as number)) {
        toLoad.push(id as number);
        this.currentSecurities.push(id as number);
      }
    }    
    console.log('currentsec='+this.currentSecurities);
    console.log('toload='+toLoad)
    if (toLoad.length > 0) {
      this.dataService.getSecurityHistory(toLoad, this.formatdate(this.mindate)).subscribe((result) => {
        if (result.status == 200) {        
          this.historyData = result.data;
          console.log(this.historyData);
          this.pushData();
          this.displayChart = true;
          }        
        else {
          // Handle the error here
          console.log('Error while retrieving historical data:');
          console.log(result);
        }
      });
    }
  }
  
  pushData() {
    if (this.dataLoaded >= 2) {
      let _lineData = this.lineData;
      this.lineData = {};
      let id;
      let name;
      for (let y of this.historyData) {
        id = y.securityid;
        name = this.securityData[id].identifier;
      
        if (!this.added.hasOwnProperty(id)) {
          this.added[id] = {
            "index": _lineData.length,
          };
          _lineData.push({
            "name": name,
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
      this.lineData = _lineData;
      console.log(this.lineData)      
    }
    else {
      console.log('groupDataBy() called but dataLoaded=' + this.dataLoaded);
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
    this.reload(this.mindate);
  }

  formatdate(d?: Date) {
    return d? d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) : undefined;
  }
}
