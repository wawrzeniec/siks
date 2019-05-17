import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

class Event {
  callback: Function = undefined;
  data: any;
  hasInit: Observable<boolean>;
  
  constructor() {
    this.hasInit = Observable.create((o) => this.do_checkInit(o));
  }

  register(f) {
    this.callback = f;
  }

  do_checkInit(observer) {
    const res = this.is_init(0);
    console.log('is_init='+res);
    if (res) {      
      observer.next(true);
    }
    else
    {
      observer.error(false);
    }
  }

  is_init(n) {    
    if (!n) {
      n = 0;
    }
    console.log('is_init('+n+')');
    if (n >= 100) {
      return false;
    }
    else {
      if(this.callback) {
        return true;
      }
      else {
        setTimeout(() => this.is_init(n+1), 100);
      }
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  reloadSummaryEvent: Event;
  reloadGraphsEvent: Event;
  reloadHistoryEvent: Event;
  loginEvent: Event;

  constructor() {    
    this.reloadSummaryEvent = new Event();
    this.reloadGraphsEvent = new Event();
    this.reloadHistoryEvent = new Event();
    this.loginEvent = new Event();
   }

  triggerReloadSummary() {
    this.reloadSummaryEvent.callback();
  }

  triggerReloadGraphs() {
    this.reloadGraphsEvent.callback();
  }

  triggerReloadHistory() {
    this.reloadHistoryEvent.callback();
  }

  triggerLogin() {
    console.log('EventService: triggering login');    
    return this.loginEvent.callback();
  }
}
