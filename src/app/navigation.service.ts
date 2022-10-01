import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  navTrigger: any;

  constructor() {}

  setTrigger(trigger) {
    this.navTrigger = trigger;
  }

  getTrigger() {
    return this.navTrigger;
  }
}
