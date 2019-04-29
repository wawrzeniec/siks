import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';

function _window(): any {
 // return the global native browser window object
 return window;
}

@Injectable({
  providedIn: 'root'
})
export class CordovaService {
   
   private resume: BehaviorSubject<boolean>;

   constructor(private zone: NgZone) {
      this.resume = new BehaviorSubject<boolean>(null);
   }
   
   ngAfterViewinit() {
      Observable.fromEvent(document, 'resume').subscribe(event => {
         this.zone.run(() => {
            this.onResume();
         });
      });
    }
   
   get cordova(): any {
      return _window().cordova;
   }

   get onCordova(): Boolean {
    return !!_window().cordova;
    }

   public onResume(): void {
      this.resume.next(true);
   }
}
