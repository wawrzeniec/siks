import { Component, OnInit } from '@angular/core';
import { LoaderService } from '@app/services/loader.service'
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  loading: boolean = true;
  loadTextBase: string = "Loading";
  loadText: string = this.loadTextBase;
  timer: number;
  i: number = 0;

  constructor(public loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.loadingState.subscribe((res)=> {
      this.toggleLoading(res);
    });
  }

  toggleLoading(state: boolean) {
    this.loading = state;
    if(state) {
      if (!this.timer) {
        this.timer = window.setInterval(this.updateText, 333);
      }
    }
    else {
      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = undefined;
      }
    }
  }
    
  updateText() {
    this.i = 1 + (this.i + 1)%3;
    this.loadText = this.loadTextBase + '.'.repeat(this.i);
  }
}
