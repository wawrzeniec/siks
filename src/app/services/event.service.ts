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
  reloadGraphsEvent: Event;
  reloadHistoryEvent: Event;

  constructor() {    
    this.reloadSummaryEvent = new Event();
    this.reloadGraphsEvent = new Event();
    this.reloadHistoryEvent = new Event();
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
}
