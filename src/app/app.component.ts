import { Component, HostListener, OnInit } from '@angular/core';
import { SessionService } from '@app/services/session.service'
import { EventService } from '@app/services/event.service'
import { ServerService } from '@app/services/server.service'
import { LocationService } from '@app/services/location.service'
import { Meta } from '@angular/platform-browser';
import { CordovaService } from '@app/services/cordova.service'
import { switchMap, tap, retryWhen, take, delay, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title: string = 'siks';

  constructor(public cordova: CordovaService,              
              public eventService: EventService,
              public sessionService: SessionService, 
              public serverService: ServerService,
              public locationService: LocationService,
              private meta: Meta) {
  };

  ngOnInit() {
    this.meta.addTag({name: "viewport",
              content:"width=device-width, initial-scale=1"});
  }

  ngAfterViewInit() {        
    /*
    if (this.cordova.onCordova === true) {
      document.addEventListener("deviceready", this.onDeviceReady, false);
      //document.addEventListener("resume", this.onResume, false);  
      this.cordova.resume.subscribe((data) => {
        console.log('Resume event received! data=' + data);
        //this.sessionService.checkSession.subscribe((data) => console.log(data))
      });      
    }*/
    this.onInit();
  }
  
  onDeviceReady() {}

  async onInit()
  {

    console.log('Initializing app...');
    await this.locationService.getServer.pipe(
      retryWhen(errors => errors.pipe(delay(100), take(5))),
      map ((loc)=>{
        console.log('After initial getServer. location=');
        console.log(this.locationService.getLocation());
      })
    ).toPromise();

    this.sessionService.checkSession.pipe(
      map((msg) => {
        console.log('After initial checkSession:');
        console.log(msg)
        if (msg==='continueSession')
          {
            this.eventService.triggerReloadSummary();
            this.eventService.triggerReloadGraphs();
          }
        }, (err) => {
          console.log('Error in app init:');
          console.log(err);
          this.sessionService.doLogin();
        }
      )
    ).subscribe(() => {console.log('Finished initializing.')});
  }

  onResume(): void {
    console.log('onResume() called!');
  }

  @HostListener('window:focus')
  onFocus(): void {
    this.sessionService.checkSession.subscribe((data) => console.log(data));
  }
}


