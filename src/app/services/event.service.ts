import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

class Event {
  callback: Function;
  data: any;
  
  constructor() {}

  register(f) {
    this.callback = f;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  reloadSummaryEvent: Event;

  constructor() {    
    this.reloadSummaryEvent = new Event();
   }

  triggerReloadSummary() {
    this.reloadSummaryEvent.callback();
  }
}
