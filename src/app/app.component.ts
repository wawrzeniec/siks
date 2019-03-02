import { Component, HostListener, OnInit } from '@angular/core';
import { SessionService } from '@app/services/session.service'
import { EventService } from '@app/services/event.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title: string = 'siks';
  
  constructor(public sessionService: SessionService, 
    public eventService: EventService) {
    
  };

  ngOnInit() {
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


