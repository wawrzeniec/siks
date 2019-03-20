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
  groupby: string="account";
  currentSecurity: number = 1;

  constructor(private dataService: DataService, 
              private eventService: EventService, 
              private configService: ConfigService,
              private accountService: AccountService) { }

  ngOnInit() {
    //this.eventService.reloadHistoryEvent.register(() => this.reload());     
  }

  reload(date?: Date) {
    console.log('SecurityGraphComponent: reloading myself!!')
    this.dataLoaded = 0;
    this.configService.getSecurities().subscribe((result) => {
      if (result.status == 200) {        
        this.processSecurityData(result.data);
        this.dataLoaded += 1;
        if(this.dataLoaded == 2) {
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

    this.dataService.getSecurityHistory(this.currentSecurity, this.formatdate(date)).subscribe((result) => {
      if (result.status == 200) {        
        this.historyData = result.data;
        this.dataLoaded += 1;
        if(this.dataLoaded == 2) {
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
    this.securityData =  new Array();
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
    this.accountData = new Array();
    for (let d of data) {
      this.accountData[d.accountid] = {
        "name": d.name, 
        "portfolioid": d.portfolioid
      }
    }
  }

  processPortfolioData(data: any) {
    this.portfolioData = new Array();
    for (let d of data) {
      this.portfolioData[d.portfolioid] = {
        "name": d.name
      }
    }
  }

  groupDataBy(key: string) {
    if (this.dataLoaded >= 4) {
      let _lineData = new Array();
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
        } else if (key=='currency') {
          id = y.currencyid;
          name = this.securityData[id].identifier;
        } else {
          id = y.securityid;
          name = this.securityData[id].identifier;
        }

        if (!added.hasOwnProperty(id)) {
          added[id] = {
            "index": _lineData.length,
          };
          _lineData.push({
            "name": name,
            "series": new Array()
          });
        }
        if (y.totalvalue != null) {        
          if (added[id].hasOwnProperty(y.timestamp)) {          
            let thisindex = added[id][y.timestamp];
            _lineData[added[id].index]["series"][thisindex].value += y.totalvalue;
          }
          else {
            added[id][y.timestamp] = _lineData[added[id].index]["series"].length;
            _lineData[added[id].index]["series"].push({
              "name": new Date(y.timestamp),
              "value": y.totalvalue
            }); 
          }
        }
      }  
      this.lineData = _lineData;
      
    }
    else {
      console.log('groupDataBy() called but dataLoaded=' + this.dataLoaded);
    }
  }

  reGroupData() {
    this.displayChart = false;
    setTimeout(() => {
      this.groupDataBy(this.groupby)
      this.displayChart = true;
    }, 0);
  }

  reDisplay() {
    if (!this.dataLoaded)
    {
      this.reload()
    }
    else {
      this.reGroupData();
    }
  }

  setRange(event) {
    let d = new Date();
    switch(event.value) {
      case "1w":
        d.setHours(d.getHours() - 7*24);
      break;
      case "1m":
        d.setMonth(d.getMonth() - 3);
      break;
      case "6m":
        d.setMonth(d.getMonth() - 6);
      break;
      case "1y":
        d.setFullYear(d.getFullYear() - 1);
      break;
      case "All":
        d = undefined; 
    }
    this.reload(d);
  }

  formatdate(d?: Date) {
    return d? d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) : undefined;
  }
}
