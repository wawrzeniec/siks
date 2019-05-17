import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loadingState: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() { }

  toggleLoading(state: boolean) {
    console.log('toggling loader state to: ' + state)
    this.loadingState.next(state);
  }
}
