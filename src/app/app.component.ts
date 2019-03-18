import { Component, HostListener, OnInit } from '@angular/core';
import { SessionService } from '@app/services/session.service'
import { EventService } from '@app/services/event.service'
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title: string = 'siks';
  
  constructor(public sessionService: SessionService, 
              public eventService: EventService,
              private meta: Meta) {
    
  };

  ngOnInit() {
    this.meta.addTag({name: "viewport",
              content:"width=device-width, initial-scale=1"});
  }

  ngAfterViewInit() {
    this.sessionService.checkSession.subscribe((msg) => {
      console.log(msg)
      console.log(this.eventService);
      this.eventService.triggerReloadSummary();
      this.eventService.triggerReloadGraphs();
    });
  }

  @HostListener('window:focus')
  onFocus(): void {
    this.sessionService.checkSession.subscribe((data) => console.log(data));
  }
}


