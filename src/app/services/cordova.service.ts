import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
//import 'rxjs/add/observable/fromEvent';
//import 'rxjs/add/operator/map';

declare var cordova;

function _window(): any {
 // return the global native browser window object
 return window;
}

@Injectable({
  providedIn: 'root'
})
export class CordovaService {
   
   public resume: BehaviorSubject<boolean>;
   public getWifiInfo: Observable<object>;

   constructor(private zone: NgZone) {
      this.resume = new BehaviorSubject<boolean>(null);
      this.getWifiInfo = Observable.create((o) => this.do_getWifiInfo(o));
   }
   
   ngAfterViewinit() {
      fromEvent(document, 'resume').subscribe(event => {
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
      console.log('onResume!!')
      this.resume.next(true);
   }

   public do_getWifiInfo(observer) {
      if (this.onCordova === true) {        
        if (cordova.plugins) {      
          cordova.plugins.wifiinfo.getInfo(
            info => {
              observer.next(info);
              observer.complete();
            },
            error => observer.error(error)
          );
        }
        else
        {
          observer.error('Cordova plugins not initialized');
        }
      }
      else
      {
        observer.next('Browser');
        observer.complete();
      }
   }  
}
