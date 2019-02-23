import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/services/data.service'
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  data: any;
  total: number|string = 'N/A';

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getSummary().subscribe( response => {
      this.data = response.data;
      this.total = response.data.total;  
    });
  }

}
