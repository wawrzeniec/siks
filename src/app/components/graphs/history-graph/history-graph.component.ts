import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/services/data.service'
import { EventService } from '@app/services/event.service'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { ChartComponent } from '@swimlane/ngx-charts/release/common/charts/chart.component'
import { BaseChartComponent } from '@swimlane/ngx-charts/release/common/base-chart.component'
import { ConfigService } from '@app/services/config.service'
import { AccountService } from '@app/services/account.service'
import { FlexLayoutModule } from '@angular/flex-layout'

//import { NgxChartsModule, BaseChartComponent, LineComponent, LineSeriesComponent,
//calculateViewDimensions, ViewDimensions, ColorHelper } from '@swimlane/ngx-charts'
//import { area, line, curveLinear } from 'd3-shape';
//import { scaleBand, scaleLinear, scalePoint, scaleTime } from 'd3-scale';

@Component({
  selector: 'app-history-graph',
  templateUrl: './history-graph.component.html',
  styleUrls: ['./history-graph.component.scss']
})
export class HistoryGraphComponent implements OnInit {
  
  displayChart: boolean = false;
  dataLoaded: number = 0;
  lineData: any = [];
  securityData: any = {};
  accountData: any = {};
  portfolioData: any = {};
  historyData: any = {};
  groupby: string="account";

  constructor(private dataService: DataService, 
              private eventService: EventService, 
              private configService: ConfigService,
              private accountService: AccountService
    ) { }

  ngOnInit() {
    //this.eventService.reloadHistoryEvent.register(() => this.reload());     
  }

  reload() {
    console.log('HistoryGraphComponent: reloading myself!!')
    this.dataLoaded = 0;
    this.configService.getSecurities().subscribe((result) => {
      if (result.status == 200) {        
        this.processSecurityData(result.data);
        this.dataLoaded += 1;
        if(this.dataLoaded == 4) {
          console.log('got securities, dataLoaded=' + this.dataLoaded + '. this.groupby=' + this.groupby)
          this.groupDataBy(this.groupby);
          this.displayChart = true;
        }
      }
      else {
        // Handle the error here
        console.log('Error while retrieving security data:');
        console.log(result);
      }
    });

    this.accountService.getAccounts().subscribe((result) => {
      if (result.status == 200) {        
        this.processAccountData(result.data);
        this.dataLoaded += 1;
        if(this.dataLoaded == 4) {
          console.log('got accounts, dataLoaded=' + this.dataLoaded + '. this.groupby=' + this.groupby)
          this.groupDataBy(this.groupby);
          this.displayChart = true;
        }
      }
      else {
        // Handle the error here
        console.log('Error while retrieving account data:');
        console.log(result);
      }
    });

    this.accountService.getPortfolios().subscribe((result) => {
      if (result.status == 200) {        
        this.processPortfolioData(result.data);
        this.dataLoaded += 1;
        if(this.dataLoaded == 4) {
          console.log('got portfolios, dataLoaded=' + this.dataLoaded + '. this.groupby=' + this.groupby)
          this.groupDataBy(this.groupby);
          this.displayChart = true;
        }
      }
      else {
        // Handle the error here
        console.log('Error while retrieving portfolio data:');
        console.log(result);
      }
    });

    this.dataService.getHistory().subscribe((result) => {
      if (result.status == 200) {        
        this.historyData = result.data;
        this.dataLoaded += 1;
        if(this.dataLoaded == 4) {
          console.log('got history, dataLoaded=' + this.dataLoaded + '. this.groupby=' + this.groupby)
          this.groupDataBy(this.groupby);
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
    this.securityData = {};
    for (let d of data) {
      this.securityData[d.securityid] = {
        "identifier": d.identifier, 
        "typeid": d.typeid,
        "categoryid": d.categoryid,
        "currency": d.currency
      }
    }
  }

  processAccountData(data: any) {
    this.accountData = {};
    for (let d of data) {
      this.accountData[d.accountid] = {
        "name": d.name, 
        "portfolioid": d.portfolioid
      }
    }
  }

  processPortfolioData(data: any) {
    this.portfolioData = {};
    for (let d of data) {
      this.portfolioData[d.portfolioid] = {
        "name": d.name
      }
    }
  }

  groupDataBy(key: string) {
    if (this.dataLoaded >= 4) {
      this.lineData = [];
      let added = {};
      let id;
      let name;
      for (let y of this.historyData) {
        if (key=='account') {
          id = y.accountid;
          name = this.accountData[id].name;
        } else if (key=='portfolio') {
          id = y.portfolioid;
          name = this.portfolioData[id].name;
        } else {
          id = y.securityid;
          name = this.securityData[id].identifier;
        }   

        if (!added.hasOwnProperty(id)) {
          added[id] = {
            "index": this.lineData.length,
          };
          this.lineData.push({
            "name": name,
            "series": []
          });
        }
        if (y.totalvalue != null) {        
          if (added[id].hasOwnProperty(y.timestamp)) {          
            let thisindex = added[id][y.timestamp];
            this.lineData[added[id].index]["series"][thisindex].value += y.totalvalue;
          }
          else {
            added[id][y.timestamp] = this.lineData[added[id].index]["series"].length;
            this.lineData[added[id].index]["series"].push({
              "name": new Date(y.timestamp),
              "value": y.totalvalue
            }); 
          }
        }
      }  
      console.log(this.lineData);      
    }
    else {
      console.log('groupDataBy() called but dataLoaded=' + this.dataLoaded);
    }
  }

  reGroupData() {
    this.lineData = [];
    this.displayChart = false;
    setTimeout(() => {
      this.groupDataBy(this.groupby)
      this.displayChart = true;
    }, 10);
  }

}
