import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/services/data.service'
import { EventService } from '@app/services/event.service'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { ChartComponent } from '@swimlane/ngx-charts/release/common/charts/chart.component'
import { BaseChartComponent } from '@swimlane/ngx-charts/release/common/base-chart.component'
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
  
  dataLoaded: boolean = false;
  lineData: any=
  [
    {
      "name": "Germany",
      "series": [
        {
          "name": "2010",
          "value": 7300000,
          "min": 7000000,
          "max": 7600000
        },
        {
          "name": "2011",
          "value": 8940000,
          "min": 8840000,
          "max": 9300000
        }
      ]
    },
  
    {
      "name": "USA",
      "series": [
        {
          "name": "2010",
          "value": 7870000,
          "min": 7800000,
          "max": 7950000
        },
        {
          "name": "2011",
          "value": 8270000,
          "min": 8170000,
          "max": 8300000
        }
      ]
    }
  ];

  constructor(private dataService: DataService, 
    private eventService: EventService) { }

  ngOnInit() {
    
  }

  reload() {
    console.log('HistoryGraphComponent: reloading myself!!')
    this.dataLoaded = true;
    console.log(this.lineData);
  }
}
