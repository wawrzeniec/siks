import { Component, HostListener, OnInit } from '@angular/core';
import { SessionService } from '@app/services/session.service'
import { EventService } from '@app/services/event.service'
import { Meta } from '@angular/platform-browser';
import { CordovaService } from '@app/services/cordova.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title: string = 'siks';
  
  constructor(public sessionService: SessionService, 
              public eventService: EventService,
              public cordova: CordovaService,
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

    console.log('ON CORDOVA:');
    console.log(this.cordova.cordova);
    console.log(this.cordova.onCordova);
  }

  @HostListener('window:focus')
  onFocus(): void {
    this.sessionService.checkSession.subscribe((data) => console.log(data));
  }
}


