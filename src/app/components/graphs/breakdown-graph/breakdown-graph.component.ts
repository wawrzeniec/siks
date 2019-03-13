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
import { FormGroup, FormControl, FormGroupDirective, Validators, FormBuilder }  from '@angular/forms';

@Component({
  selector: 'app-breakdown-graph',
  templateUrl: './breakdown-graph.component.html',
  styleUrls: ['./breakdown-graph.component.scss']
})
export class BreakdownGraphComponent implements OnInit {

  displayChart: boolean = false;
  dataLoaded: number = 0;
  lineData: any = [];
  securityData: any = {};
  accountData: any = {};
  portfolioData: any = {};
  breakdownData: any = {};
  groupby: string="account";

  curdate: Date = new Date();
  dateCtrl: FormControl = new FormControl(this.curdate, []);

  constructor(private dataService: DataService, 
              private eventService: EventService, 
              private configService: ConfigService,
              private accountService: AccountService
    ) { }

  ngOnInit() {    
  }

  reload(date?: Date) {
    console.log('BreakdownGraphComponent: reloading myself!! date=' + date)
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

    this.dataService.getBreakdown(this.formatdate(date)).subscribe((result) => {
      if (result.status == 200) {        
        this.breakdownData = result.data;
        this.dataLoaded += 1;
        if(this.dataLoaded == 4) {
          console.log('got breakdown, dataLoaded=' + this.dataLoaded + '. this.groupby=' + this.groupby)
          this.groupDataBy(this.groupby);
          this.displayChart = true;
        }
      }
      else {
        // Handle the error here
        console.log('Error while retrieving breakdown data:');
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
      let _lineData = [];
      let added = {};
      let id;
      let name;
      for (let y of this.breakdownData) {
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
            "value": y.totalvalue
          });
        }
        else {
          _lineData[added[id].index]["value"] += y.totalvalue;
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

  updateDate() {
    let newdate = this.dateCtrl.value;    
    if (newdate != this.curdate) {
      this.curdate = newdate;
      this.reload(this.curdate);

    }
    
  }

  formatdate(d?: Date) {
    return d? d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) : undefined;
  }

}
